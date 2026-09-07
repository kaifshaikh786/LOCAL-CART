using LocalCart.Api.Entities;

namespace LocalCart.Api.Interfaces.Repositories;

public interface IUserRepository
{
    Task<AppUser?> GetByEmailAsync(string email);

    Task<AppUser?> GetByIdAsync(int id);

    Task<bool> ExistsByEmailAsync(string email);

    Task<Role?> GetRoleByNameAsync(string roleName);

    Task<AppUser> AddAsync(AppUser user);

    Task AddUserRoleAsync(AppUserRole userRole);

    Task AddVendorAsync(Vendor vendor);

    Task SaveChangesAsync();
}

