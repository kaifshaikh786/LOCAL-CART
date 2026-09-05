using LocalCart.Api.Data;
using LocalCart.Api.Entities;
using LocalCart.Api.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace LocalCart.Api.Repositories;

public class VendorRepository : IVendorRepository
{
    private readonly LocalCartDbContext _dbContext;
    public VendorRepository(LocalCartDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<Vendor>> GetAllAsync(bool includeInactive = false)
    {
        var query = _dbContext.Vendors.AsNoTracking().Where(v => v.DeletedAt == null);

        if (!includeInactive)
        {
            query = query.Where(v => v.IsActive);
        }
        return await query.OrderBy(v => v.ShopName).ToListAsync();
    }

    public async Task<Vendor?> GetByIdAsync(int id)
    {
        return await _dbContext.Vendors
            .AsNoTracking()
            .FirstOrDefaultAsync(v => v.VendorId == id && v.DeletedAt == null);
    }

    public async Task<Vendor> AddAsync(Vendor vendor)
    {
        _dbContext.Vendors.Add(vendor);
        await _dbContext.SaveChangesAsync();
        return vendor;
    }

    public async Task UpdateAsync(Vendor vendor)
    {
        _dbContext.Vendors.Update(vendor);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var vendor = await _dbContext.Vendors.FindAsync(id);
        if (vendor is null || vendor.DeletedAt != null) return false;

        vendor.DeletedAt = DateTime.UtcNow;
        vendor.UpdatedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsByEmailAsync(string email, int? excludeId = null)
    {
        var query = _dbContext.Vendors
            .Where(v => v.Email != null && v.Email.ToLower() == email.ToLower() && v.DeletedAt == null);

        if (excludeId.HasValue)
        {
            query = query.Where(v => v.VendorId != excludeId.Value);
        }

        return await query.AnyAsync();
    }
}