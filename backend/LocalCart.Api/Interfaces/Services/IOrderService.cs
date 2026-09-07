using LocalCart.Api.DTOs.Orders;

namespace LocalCart.Api.Interfaces.Services;

public interface IOrderService
{
    Task<OrderDto> BookOrderAsync(CreateOrderDto dto);
    Task<IEnumerable<OrderDto>> GetMyVendorOrdersAsync(int appUserId, string? status = null);
    Task<OrderDto> GetOrderByIdAsync(int orderId, int appUserId, bool isAdmin = false);
    Task<OrderDto> GetOrderByOrderNumberAsync(string orderNumber);
    Task<OrderDto> UpdateOrderStatusAsync(int orderId, string newStatus, int appUserId, bool isAdmin = false);
}
