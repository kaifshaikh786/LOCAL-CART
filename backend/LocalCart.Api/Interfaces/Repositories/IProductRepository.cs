using LocalCart.Api.Entities;

namespace LocalCart.Api.Interfaces.Repositories;

public interface IProductRepository
{
    Task<IEnumerable<Product>> GetAllAsync(int? vendorId = null, int? categoryId = null, string? search = null, bool includeUnavailable = false);

    Task<Product?> GetByIdAsync(int id);

    Task<Product> AddAsync(Product product);

    Task UpdateAsync(Product product);

    Task<bool> DeleteAsync(int id);

    Task<bool> CategoryExistsAsync(int categoryId);
}

