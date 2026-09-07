using System.Security.Claims;
using LocalCart.Api.DTOs.Orders;
using LocalCart.Api.Exceptions;
using LocalCart.Api.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LocalCart.Api.Controllers;

[ApiController]
[Route("orders")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    /// <summary>
    /// Books a new order from a customer (guests or logged-in customers).
    /// Enforces single-vendor policy and deducts inventory.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<OrderDto>> BookOrder([FromBody] CreateOrderDto dto)
    {
        var created = await _orderService.BookOrderAsync(dto);
        return CreatedAtAction(nameof(LookupByOrderNumber), new { orderNumber = created.OrderNumber }, created);
    }

    /// <summary>
    /// Retrieves incoming orders for the authenticated vendor.
    /// </summary>
    [Authorize(Roles = "Vendor,Admin")]
    [HttpGet("my-orders")]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetMyVendorOrders([FromQuery] string? status = null)
    {
        var appUserId = GetCurrentAppUserId();
        var orders = await _orderService.GetMyVendorOrdersAsync(appUserId, status);
        return Ok(orders);
    }

    /// <summary>
    /// Public lookup for customers to view order status by order number.
    /// </summary>
    [HttpGet("lookup/{orderNumber}")]
    public async Task<ActionResult<OrderDto>> LookupByOrderNumber(string orderNumber)
    {
        var order = await _orderService.GetOrderByOrderNumberAsync(orderNumber);
        return Ok(order);
    }

    /// <summary>
    /// Retrieves a single order by ID for the vendor who owns it or an Admin.
    /// </summary>
    [Authorize(Roles = "Vendor,Admin")]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrderDto>> GetById(int id)
    {
        var appUserId = GetCurrentAppUserId();
        var isAdmin = User.IsInRole("Admin");

        var order = await _orderService.GetOrderByIdAsync(id, appUserId, isAdmin);
        return Ok(order);
    }

    /// <summary>
    /// Updates the order status (e.g. Pending -> Accepted -> ReadyForPickup -> Completed / Cancelled).
    /// Restores inventory if cancelled.
    /// </summary>
    [Authorize(Roles = "Vendor,Admin")]
    [HttpPut("{id:int}/status")]
    public async Task<ActionResult<OrderDto>> UpdateStatus(int id, [FromBody] UpdateOrderStatusDto dto)
    {
        var appUserId = GetCurrentAppUserId();
        var isAdmin = User.IsInRole("Admin");

        var updated = await _orderService.UpdateOrderStatusAsync(id, dto.Status, appUserId, isAdmin);
        return Ok(updated);
    }

    private int GetCurrentAppUserId()
    {
        var subClaim = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub");

        if (string.IsNullOrEmpty(subClaim) || !int.TryParse(subClaim, out var appUserId))
        {
            throw new UnauthorizedException("Invalid or missing user identity in authentication token.");
        }

        return appUserId;
    }
}
