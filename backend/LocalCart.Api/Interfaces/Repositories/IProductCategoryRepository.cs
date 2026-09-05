using LocalCart.Api.Entities;

namespace LocalCart.Api.Interfaces.Repositories;

public interface IProductCategoryRepository
{
    Task<IEnumerable<ProductCategory>> GetAllAsync(bool includeInActive = false);
    Task<ProductCategory?> GetByIdAsync(int id);
    Task<ProductCategory> AddAsync(ProductCategory category);
    Task UpdateAsync(ProductCategory category);
    Task<bool> DeleteAsync(int id);
    Task<bool> ExistsByNameAsync(string categoryName, int? excludeId = null);
}