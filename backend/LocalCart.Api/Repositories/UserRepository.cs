using LocalCart.Api.Data;
using LocalCart.Api.Entities;
using LocalCart.Api.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace LocalCart.Api.Repositories;

public class UserRepository : IUserRepository
{
    private readonly LocalCartDbContext _dbContext;

    public UserRepository(LocalCartDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<AppUser?> GetByEmailAsync(string email)
    {
        var normalized = email.Trim().ToUpperInvariant();

        return await _dbContext.AppUsers
            .Include(u => u.AppUserRoles)
                .ThenInclude(ur => ur.Role)
            .Include(u => u.Vendors.Where(v => v.DeletedAt == null))
            .FirstOrDefaultAsync(u => u.NormalizedEmail == normalized && u.DeletedAt == null);
    }

    public async Task<AppUser?> GetByIdAsync(int id)
    {
        return await _dbContext.AppUsers
            .Include(u => u.AppUserRoles)
                .ThenInclude(ur => ur.Role)
            .Include(u => u.Vendors.Where(v => v.DeletedAt == null))
            .FirstOrDefaultAsync(u => u.AppUserId == id && u.DeletedAt == null);
    }

    public async Task<bool> ExistsByEmailAsync(string email)
    {
        var normalized = email.Trim().ToUpperInvariant();

        return await _dbContext.AppUsers
            .AnyAsync(u => u.NormalizedEmail == normalized && u.DeletedAt == null);
    }

    public async Task<Role?> GetRoleByNameAsync(string roleName)
    {
        return await _dbContext.Roles
            .FirstOrDefaultAsync(r => r.RoleName.ToLower() == roleName.Trim().ToLower());
    }

    public async Task<AppUser> AddAsync(AppUser user)
    {
        _dbContext.AppUsers.Add(user);
        await _dbContext.SaveChangesAsync();
        return user;
    }

    public async Task AddUserRoleAsync(AppUserRole userRole)
    {
        _dbContext.AppUserRoles.Add(userRole);
        await _dbContext.SaveChangesAsync();
    }

    public async Task AddVendorAsync(Vendor vendor)
    {
        _dbContext.Vendors.Add(vendor);
        await _dbContext.SaveChangesAsync();
    }

    public async Task SaveChangesAsync()
    {
        await _dbContext.SaveChangesAsync();
    }
}

