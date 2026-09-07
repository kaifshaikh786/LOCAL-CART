using LocalCart.Api.DTOs.Vendors;

namespace LocalCart.Api.Interfaces.Services;

public interface IVendorService
{
    Task<IEnumerable<VendorDto>> GetAllAsync(bool includeInactive = false);
    Task<VendorDto?> GetByIdAsync(int id);
    Task<VendorDto> CreateAsync(CreateVendorDto dto);
    Task<bool> UpdateAsync(int id, UpdateVendorDto dto);
    Task DeleteAsync(int id);
}