using LocalCart.Api.DTOs.Products;

namespace LocalCart.Api.Interfaces.Services;

public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetAllAsync(int? vendorId = null, int? categoryId = null, string? search = null, bool includeUnavailable = false);

    Task<ProductDto?> GetByIdAsync(int id);

    Task<IEnumerable<ProductDto>> GetMyProductsAsync(int appUserId);

    Task<ProductDto> CreateProductAsync(CreateProductDto dto, int appUserId, bool isAdmin = false);

    Task<ProductDto> UpdateProductAsync(int productId, UpdateProductDto dto, int appUserId, bool isAdmin = false);

    Task DeleteProductAsync(int productId, int appUserId, bool isAdmin = false);
}

