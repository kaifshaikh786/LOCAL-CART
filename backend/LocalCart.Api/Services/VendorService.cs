using LocalCart.Api.DTOs.Vendors;
using LocalCart.Api.Entities;
using LocalCart.Api.Exceptions;
using LocalCart.Api.Interfaces.Repositories;
using LocalCart.Api.Interfaces.Services;

namespace LocalCart.Api.Services;

public class VendorService : IVendorService
{
    private readonly IVendorRepository _repository;
    public VendorService(IVendorRepository repository)
    {
        _repository = repository;
    }
    public async Task<IEnumerable<VendorDto>> GetAllAsync(bool includeInactive = false)
    {
        var vendors = await _repository.GetAllAsync(includeInactive);
        return vendors.Select(MapToDto);
    }

    public async Task<VendorDto?> GetByIdAsync(int id)
    {
        var vendor = await _repository.GetByIdAsync(id);
        return vendor is null ? null : MapToDto(vendor);
    }

    public async Task<VendorDto> CreateAsync(CreateVendorDto dto)
    {
        if (!string.IsNullOrWhiteSpace(dto.Email))
        {
            var emailExists = await _repository.ExistsByEmailAsync(dto.Email);
            if (emailExists)
            {
                throw new ConflictException($"A vendor with email '{dto.Email}' already exists.");
            }
        }

        var vendor = new Vendor
        {
            ShopName = dto.ShopName,
            OwnerName = dto.OwnerName,
            PhoneNumber = dto.PhoneNumber,
            Email = dto.Email,
            Address = dto.Address,
            City = dto.City,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _repository.AddAsync(vendor);
        return MapToDto(created);
    }

    public async Task<bool> UpdateAsync(int id, UpdateVendorDto dto)
    {
        var vendor = await _repository.GetByIdAsync(id)
            ?? throw new NotFoundException($"Vendor with id {id} not found.");

        if (!string.IsNullOrWhiteSpace(dto.Email))
        {
            var emailExists = await _repository.ExistsByEmailAsync(dto.Email, excludeId: id);
            if (emailExists)
            {
                throw new ConflictException($"A vendor with email '{dto.Email}' already exists.");
            }
        }

        vendor.ShopName = dto.ShopName;
        vendor.OwnerName = dto.OwnerName;
        vendor.PhoneNumber = dto.PhoneNumber;
        vendor.Email = dto.Email;
        vendor.Address = dto.Address;
        vendor.City = dto.City;
        vendor.IsActive = dto.IsActive;
        vendor.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(vendor);
        return true;
    }

    public async Task DeleteAsync(int id)
    {
        var deleted = await _repository.DeleteAsync(id);
        if (!deleted)
        {
            throw new NotFoundException($"Vendor with id {id} not found.");
        }
    }

    private static VendorDto MapToDto(Vendor vendor)
    {
        return new VendorDto
        {
            VendorId = vendor.VendorId,
            ShopName = vendor.ShopName,
            OwnerName = vendor.OwnerName,
            PhoneNumber = vendor.PhoneNumber,
            Email = vendor.Email,
            Address = vendor.Address,
            City = vendor.City,
            IsActive = vendor.IsActive,
            CreatedAt = vendor.CreatedAt,
            UpdatedAt = vendor.UpdatedAt
        };
    }
}