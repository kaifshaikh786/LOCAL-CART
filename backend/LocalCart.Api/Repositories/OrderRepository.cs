using LocalCart.Api.Data;
using LocalCart.Api.Entities;
using LocalCart.Api.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace LocalCart.Api.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly LocalCartDbContext _dbContext;

    public OrderRepository(LocalCartDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Order> CreateOrderAsync(Order order)
    {
        await _dbContext.Orders.AddAsync(order);
        await _dbContext.SaveChangesAsync();
        return order;
    }

    public async Task<Order?> GetByIdAsync(int orderId)
    {
        return await _dbContext.Orders
            .Include(o => o.Vendor)
            .Include(o => o.OrderItems)
                .ThenInclude(i => i.Product)
                    .ThenInclude(p => p.ProductImages)
            .FirstOrDefaultAsync(o => o.OrderId == orderId && o.DeletedAt == null);
    }

    public async Task<Order?> GetByOrderNumberAsync(string orderNumber)
    {
        return await _dbContext.Orders
            .Include(o => o.Vendor)
            .Include(o => o.OrderItems)
                .ThenInclude(i => i.Product)
                    .ThenInclude(p => p.ProductImages)
            .FirstOrDefaultAsync(o => o.OrderNumber == orderNumber.Trim() && o.DeletedAt == null);
    }

    public async Task<IEnumerable<Order>> GetByVendorIdAsync(int vendorId, string? status = null)
    {
        var query = _dbContext.Orders
            .AsNoTracking()
            .Include(o => o.Vendor)
            .Include(o => o.OrderItems)
                .ThenInclude(i => i.Product)
                    .ThenInclude(p => p.ProductImages)
            .Where(o => o.VendorId == vendorId && o.DeletedAt == null);

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(o => o.OrderStatus.ToLower() == status.Trim().ToLower());
        }

        return await query.OrderByDescending(o => o.CreatedAt).ToListAsync();
    }

    public async Task<Order> UpdateAsync(Order order)
    {
        _dbContext.Orders.Update(order);
        await _dbContext.SaveChangesAsync();
        return order;
    }

    public async Task SaveChangesAsync()
    {
        await _dbContext.SaveChangesAsync();
    }
}
