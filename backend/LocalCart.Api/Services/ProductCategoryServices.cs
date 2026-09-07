using LocalCart.Api.DTOs.ProductCategories;
using LocalCart.Api.Entities;
using LocalCart.Api.Exceptions;
using LocalCart.Api.Interfaces.Repositories;
using LocalCart.Api.Interfaces.Services;
using Microsoft.EntityFrameworkCore.Metadata;

namespace LocalCart.Api.Services;

public class ProductCategoryServices : IProductCategoryServices
{
    private readonly IProductCategoryRepository _categoryRepository;
    public ProductCategoryServices(IProductCategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }
    public async Task<ProductCategoryDto> CreateAsync(CreateProductCategoryDto dto)
    {
        var nameExists = await _categoryRepository.ExistsByNameAsync(dto.CategoryName);
        if (nameExists)
        {
            throw new ConflictException($"A category named '{dto.CategoryName}' already exists.");
        }

        var category = new ProductCategory
        {
            CategoryName = dto.CategoryName,
            Description = dto.Description,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _categoryRepository.AddAsync(category);
        return MaptoDto(created);
    }

    public async Task DeleteAsync(int id)
    {
        var deleted = await _categoryRepository.DeleteAsync(id);
        if (!deleted)
        {
            throw new NotFoundException($"Category with id {id} not found.");
        }
    }

    public async Task<IEnumerable<ProductCategoryDto>> GetAllAsync(bool includeInactive = false)
    {
        var categories = await _categoryRepository.GetAllAsync(includeInactive);
        return categories.Select(MaptoDto);
    }

    public async Task<ProductCategoryDto?> GetByIdAsync(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id)
            ?? throw new NotFoundException($"Category with id {id} not found.");
        return MaptoDto(category);
    }

    public async Task UpdateAsync(int id, UpdateProductCategoryDto dto)
    {
        var category = await _categoryRepository.GetByIdAsync(id)
            ?? throw new NotFoundException($"Category with id {id} not found.");

        var nameExists = await _categoryRepository.ExistsByNameAsync(dto.CategoryName, excludeId: id);
        if (nameExists)
        {
            throw new ConflictException($"A category named '{dto.CategoryName}' already exists.");
        }

        category.CategoryName = dto.CategoryName;
        category.Description = dto.Description;
        category.IsActive = dto.IsActive;
        category.UpdatedAt = DateTime.UtcNow;

        await _categoryRepository.UpdateAsync(category);
    }
    private static ProductCategoryDto MaptoDto(ProductCategory category)
    {
        return new ProductCategoryDto
        {
            ProductCategoryId = category.ProductCategoryId,
            CategoryName = category.CategoryName,
            Description = category.Description,
            IsActive = category.IsActive,
            CreatedAt = category.CreatedAt,
            UpdatedAt = category.UpdatedAt
        };
    }
}