using LocalCart.Api.Data;
using LocalCart.Api.Entities;
using LocalCart.Api.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace LocalCart.Api.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly LocalCartDbContext _dbContext;

    public ProductRepository(LocalCartDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<Product>> GetAllAsync(
        int? vendorId = null,
        int? categoryId = null,
        string? search = null,
        bool includeUnavailable = false)
    {
        var query = _dbContext.Products
            .AsNoTracking()
            .Include(p => p.Vendor)
            .Include(p => p.ProductCategory)
            .Include(p => p.ProductImages.OrderBy(i => i.SortOrder))
            .Where(p => p.DeletedAt == null && p.Vendor.DeletedAt == null);

        if (!includeUnavailable)
        {
            query = query.Where(p => p.IsAvailable && p.StockQuantity > 0 && p.Vendor.IsActive);
        }

        if (vendorId.HasValue)
        {
            query = query.Where(p => p.VendorId == vendorId.Value);
        }

        if (categoryId.HasValue)
        {
            query = query.Where(p => p.ProductCategoryId == categoryId.Value);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(p =>
                p.Name.ToLower().Contains(term) ||
                (p.Description != null && p.Description.ToLower().Contains(term)) ||
                p.Vendor.ShopName.ToLower().Contains(term));
        }

        return await query.OrderByDescending(p => p.CreatedAt).ToListAsync();
    }

    public async Task<Product?> GetByIdAsync(int id)
    {
        return await _dbContext.Products
            .AsNoTracking()
            .Include(p => p.Vendor)
            .Include(p => p.ProductCategory)
            .Include(p => p.ProductImages.OrderBy(i => i.SortOrder))
            .FirstOrDefaultAsync(p => p.ProductId == id && p.DeletedAt == null);
    }

    public async Task<Product> AddAsync(Product product)
    {
        _dbContext.Products.Add(product);
        await _dbContext.SaveChangesAsync();
        return product;
    }

    public async Task UpdateAsync(Product product)
    {
        _dbContext.Products.Update(product);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var product = await _dbContext.Products.FindAsync(id);
        if (product is null || product.DeletedAt != null) return false;

        product.DeletedAt = DateTime.UtcNow;
        product.UpdatedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> CategoryExistsAsync(int categoryId)
    {
        return await _dbContext.ProductCategories
            .AnyAsync(c => c.ProductCategoryId == categoryId && c.IsActive);
    }
}

