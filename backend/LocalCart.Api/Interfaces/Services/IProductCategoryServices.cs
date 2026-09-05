using LocalCart.Api.DTOs.ProductCategories;

namespace LocalCart.Api.Interfaces.Services;

public interface IProductCategoryServices
{
    Task<IEnumerable<ProductCategoryDto>> GetAllAsync(bool includeInactive = false);
    Task<ProductCategoryDto?> GetByIdAsync(int id);
    Task<ProductCategoryDto> CreateAsync(CreateProductCategoryDto dto);
    Task UpdateAsync(int id, UpdateProductCategoryDto dto);
    Task DeleteAsync(int id);
}