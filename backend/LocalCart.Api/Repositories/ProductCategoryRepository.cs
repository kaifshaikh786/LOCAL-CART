using LocalCart.Api.Data;
using LocalCart.Api.Entities;
using LocalCart.Api.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace LocalCart.Api.Repositories;

public class ProductCategoryRepository : IProductCategoryRepository
{
    private readonly LocalCartDbContext _dbContext;
    public ProductCategoryRepository(LocalCartDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task<ProductCategory> AddAsync(ProductCategory category)
    {
        _dbContext.ProductCategories.Add(category);
        await _dbContext.SaveChangesAsync();
        return category;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var category = await _dbContext.ProductCategories.FindAsync(id);
        if (category == null) return false;

        category.IsActive = false;
        category.UpdatedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsByNameAsync(string categoryName, int? excludeId = null)
    {
        var query = _dbContext.ProductCategories
            .Where(c => c.CategoryName.ToLower() == categoryName.ToLower());

        if (excludeId.HasValue)
        {
            query = query.Where(c => c.ProductCategoryId != excludeId.Value);
        }

        return await query.AnyAsync();
    }

    public async Task<IEnumerable<ProductCategory>> GetAllAsync(bool includeInActive = false)
    {
        var query = _dbContext.ProductCategories.AsNoTracking().AsQueryable();

        if (!includeInActive)
        {
            query = query.Where(c => c.IsActive);
        }

        return await query.OrderBy(c => c.CategoryName).ToListAsync();
    }

    public async Task<ProductCategory?> GetByIdAsync(int id)
    {
        return await _dbContext.ProductCategories.AsNoTracking().FirstOrDefaultAsync(c => c.ProductCategoryId == id);
    }

    public async Task UpdateAsync(ProductCategory category)
    {
        _dbContext.ProductCategories.Update(category);
        await _dbContext.SaveChangesAsync();
    }
}