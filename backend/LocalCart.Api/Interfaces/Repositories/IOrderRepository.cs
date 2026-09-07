using LocalCart.Api.Entities;

namespace LocalCart.Api.Interfaces.Repositories;

public interface IOrderRepository
{
    Task<Order> CreateOrderAsync(Order order);
    Task<Order?> GetByIdAsync(int orderId);
    Task<Order?> GetByOrderNumberAsync(string orderNumber);
    Task<IEnumerable<Order>> GetByVendorIdAsync(int vendorId, string? status = null);
    Task<Order> UpdateAsync(Order order);
    Task SaveChangesAsync();
}
