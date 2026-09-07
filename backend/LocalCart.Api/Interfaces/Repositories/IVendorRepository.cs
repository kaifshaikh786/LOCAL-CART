using LocalCart.Api.Entities;

namespace LocalCart.Api.Interfaces.Repositories;

public interface IVendorRepository
{
    Task<IEnumerable<Vendor>> GetAllAsync(bool includeInactive = false);
    Task<Vendor?> GetByIdAsync(int id);
    Task<Vendor> AddAsync(Vendor vendor);
    Task UpdateAsync(Vendor vendor);
    Task<bool> DeleteAsync(int id); // soft delete -> sets DeletedAt
    Task<bool> ExistsByEmailAsync(string email, int? excludeId = null);
    Task<Vendor?> GetByAppUserIdAsync(int appUserId);
}