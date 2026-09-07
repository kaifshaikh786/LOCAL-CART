using LocalCart.Api.Data;
using LocalCart.Api.DTOs.Orders;
using LocalCart.Api.Entities;
using LocalCart.Api.Exceptions;
using LocalCart.Api.Interfaces.Repositories;
using LocalCart.Api.Interfaces.Services;
using Microsoft.EntityFrameworkCore;

namespace LocalCart.Api.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IVendorRepository _vendorRepository;
    private readonly LocalCartDbContext _dbContext;

    private static readonly HashSet<string> ValidStatuses = new(StringComparer.OrdinalIgnoreCase)
    {
        "Pending",
        "Accepted",
        "ReadyForPickup",
        "Completed",
        "Cancelled"
    };

    public OrderService(
        IOrderRepository orderRepository,
        IVendorRepository vendorRepository,
        LocalCartDbContext dbContext)
    {
        _orderRepository = orderRepository;
        _vendorRepository = vendorRepository;
        _dbContext = dbContext;
    }

    public async Task<OrderDto> BookOrderAsync(CreateOrderDto dto)
    {
        if (dto.Items == null || dto.Items.Count == 0)
        {
            throw new BadRequestException("Order must contain at least one item.");
        }

        if (dto.DeliveryMethod == "Home Delivery" && string.IsNullOrWhiteSpace(dto.DeliveryAddress))
        {
            throw new BadRequestException("Delivery address is required for Home Delivery orders.");
        }

        var productIds = dto.Items.Select(i => i.ProductId).Distinct().ToList();

        // Load all requested products from database
        var products = await _dbContext.Products
            .Include(p => p.Vendor)
            .Include(p => p.ProductImages)
            .Where(p => productIds.Contains(p.ProductId) && p.DeletedAt == null)
            .ToListAsync();

        if (products.Count != productIds.Count)
        {
            throw new BadRequestException("One or more selected products could not be found or are no longer available.");
        }

        // 1. Single-Vendor Cart Policy Enforcement
        var vendorIds = products.Select(p => p.VendorId).Distinct().ToList();
        if (vendorIds.Count > 1)
        {
            throw new BadRequestException("An order can only contain items from one vendor at a time. Please place separate orders for each vendor.");
        }

        var vendor = products[0].Vendor;
        if (!vendor.IsActive || vendor.DeletedAt != null)
        {
            throw new BadRequestException($"The vendor '{vendor.ShopName}' is currently not accepting orders.");
        }

        // 2. Validate product availability and inventory
        foreach (var itemDto in dto.Items)
        {
            var product = products.First(p => p.ProductId == itemDto.ProductId);

            if (!product.IsAvailable)
            {
                throw new BadRequestException($"Product '{product.Name}' is currently marked unavailable.");
            }

            if (product.StockQuantity < itemDto.Quantity)
            {
                throw new BadRequestException($"Insufficient stock for '{product.Name}'. Available: {product.StockQuantity}, Requested: {itemDto.Quantity}.");
            }
        }

        // 3. Generate unique order number (Format: LC-YYMMDD-XXXX)
        var datePrefix = DateTime.UtcNow.ToString("yyMMdd");
        var randSuffix = Guid.NewGuid().ToString("N")[..4].ToUpperInvariant();
        var orderNumber = $"LC-{datePrefix}-{randSuffix}";

        // 4. Begin transaction for atomic stock deduction and order creation
        await using var transaction = await _dbContext.Database.BeginTransactionAsync();
        try
        {
            decimal totalAmount = 0;
            var orderItems = new List<OrderItem>();

            foreach (var itemDto in dto.Items)
            {
                var product = products.First(p => p.ProductId == itemDto.ProductId);

                // Deduct stock
                product.StockQuantity -= itemDto.Quantity;
                product.UpdatedAt = DateTime.UtcNow;

                var lineTotal = product.Price * itemDto.Quantity;
                totalAmount += lineTotal;

                orderItems.Add(new OrderItem
                {
                    ProductId = product.ProductId,
                    ProductName = product.Name,
                    UnitPrice = product.Price,
                    Quantity = itemDto.Quantity,
                    LineTotal = lineTotal
                });
            }

            var order = new Order
            {
                OrderNumber = orderNumber,
                VendorId = vendor.VendorId,
                CustomerName = dto.CustomerName.Trim(),
                CustomerEmail = dto.CustomerEmail.Trim().ToLowerInvariant(),
                CustomerPhone = dto.CustomerPhone.Trim(),
                DeliveryMethod = dto.DeliveryMethod.Trim(),
                DeliveryAddress = dto.DeliveryMethod == "Home Delivery" ? dto.DeliveryAddress?.Trim() : null,
                TotalAmount = totalAmount,
                OrderStatus = "Pending",
                CreatedAt = DateTime.UtcNow,
                OrderItems = orderItems
            };

            await _dbContext.Orders.AddAsync(order);
            await _dbContext.SaveChangesAsync();
            await transaction.CommitAsync();

            // Load complete entity for return
            var savedOrder = await _orderRepository.GetByIdAsync(order.OrderId);
            return MapToDto(savedOrder ?? order);
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<IEnumerable<OrderDto>> GetMyVendorOrdersAsync(int appUserId, string? status = null)
    {
        var vendor = await _vendorRepository.GetByAppUserIdAsync(appUserId)
            ?? throw new NotFoundException("Vendor profile not found for the authenticated user.");

        var orders = await _orderRepository.GetByVendorIdAsync(vendor.VendorId, status);
        return orders.Select(MapToDto);
    }

    public async Task<OrderDto> GetOrderByIdAsync(int orderId, int appUserId, bool isAdmin = false)
    {
        var order = await _orderRepository.GetByIdAsync(orderId)
            ?? throw new NotFoundException($"Order with ID {orderId} not found.");

        if (!isAdmin)
        {
            var vendor = await _vendorRepository.GetByAppUserIdAsync(appUserId);
            if (vendor == null || vendor.VendorId != order.VendorId)
            {
                throw new ForbiddenAccessException("You do not have permission to view this order.");
            }
        }

        return MapToDto(order);
    }

    public async Task<OrderDto> GetOrderByOrderNumberAsync(string orderNumber)
    {
        var order = await _orderRepository.GetByOrderNumberAsync(orderNumber)
            ?? throw new NotFoundException($"Order with number '{orderNumber}' not found.");

        return MapToDto(order);
    }

    public async Task<OrderDto> UpdateOrderStatusAsync(int orderId, string newStatus, int appUserId, bool isAdmin = false)
    {
        var normalizedStatus = ValidStatuses.FirstOrDefault(s => s.Equals(newStatus.Trim(), StringComparison.OrdinalIgnoreCase))
            ?? throw new BadRequestException($"Invalid order status '{newStatus}'. Allowed values: Pending, Accepted, ReadyForPickup, Completed, Cancelled.");

        var order = await _orderRepository.GetByIdAsync(orderId)
            ?? throw new NotFoundException($"Order with ID {orderId} not found.");

        if (!isAdmin)
        {
            var vendor = await _vendorRepository.GetByAppUserIdAsync(appUserId);
            if (vendor == null || vendor.VendorId != order.VendorId)
            {
                throw new ForbiddenAccessException("You do not have permission to update this order.");
            }
        }

        var oldStatus = order.OrderStatus;

        // If transitioning to Cancelled and wasn't already cancelled, restore inventory
        if (normalizedStatus.Equals("Cancelled", StringComparison.OrdinalIgnoreCase) &&
            !oldStatus.Equals("Cancelled", StringComparison.OrdinalIgnoreCase))
        {
            foreach (var item in order.OrderItems)
            {
                var product = await _dbContext.Products.FindAsync(item.ProductId);
                if (product != null)
                {
                    product.StockQuantity += item.Quantity;
                    product.UpdatedAt = DateTime.UtcNow;
                }
            }
        }

        order.OrderStatus = normalizedStatus;
        order.UpdatedAt = DateTime.UtcNow;

        await _orderRepository.UpdateAsync(order);
        return MapToDto(order);
    }

    private static OrderDto MapToDto(Order order)
    {
        return new OrderDto
        {
            OrderId = order.OrderId,
            OrderNumber = order.OrderNumber,
            VendorId = order.VendorId,
            VendorShopName = order.Vendor?.ShopName ?? string.Empty,
            CustomerName = order.CustomerName,
            CustomerEmail = order.CustomerEmail,
            CustomerPhone = order.CustomerPhone,
            DeliveryMethod = order.DeliveryMethod,
            DeliveryAddress = order.DeliveryAddress,
            TotalAmount = order.TotalAmount,
            OrderStatus = order.OrderStatus,
            CreatedAt = order.CreatedAt,
            UpdatedAt = order.UpdatedAt,
            Items = order.OrderItems.Select(i => new OrderItemDto
            {
                OrderItemId = i.OrderItemId,
                ProductId = i.ProductId,
                ProductName = i.ProductName,
                UnitPrice = i.UnitPrice,
                Quantity = i.Quantity,
                LineTotal = i.LineTotal,
                ImageUrl = i.Product?.ProductImages?.OrderBy(img => img.SortOrder).FirstOrDefault()?.ImageUrl
            }).ToList()
        };
    }
}
