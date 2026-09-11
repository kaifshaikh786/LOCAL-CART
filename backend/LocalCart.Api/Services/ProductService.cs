using LocalCart.Api.DTOs.Products;
using LocalCart.Api.Entities;
using LocalCart.Api.Exceptions;
using LocalCart.Api.Interfaces.Repositories;
using LocalCart.Api.Interfaces.Services;

namespace LocalCart.Api.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly IVendorRepository _vendorRepository;

    public ProductService(
        IProductRepository productRepository,
        IVendorRepository vendorRepository)
    {
        _productRepository = productRepository;
        _vendorRepository = vendorRepository;
    }

    public async Task<IEnumerable<ProductDto>> GetAllAsync(
        int? vendorId = null,
        int? categoryId = null,
        string? search = null,
        bool includeUnavailable = false)
    {
        var products = await _productRepository.GetAllAsync(vendorId, categoryId, search, includeUnavailable);
        return products.Select(MapToDto);
    }

    public async Task<ProductDto?> GetByIdAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        return product is null ? null : MapToDto(product);
    }

    public async Task<IEnumerable<ProductDto>> GetMyProductsAsync(int appUserId)
    {
        var vendor = await _vendorRepository.GetByAppUserIdAsync(appUserId)
            ?? throw new NotFoundException("Vendor profile not found for the authenticated user.");

        var products = await _productRepository.GetAllAsync(vendorId: vendor.VendorId, includeUnavailable: true);
        return products.Select(MapToDto);
    }

    public async Task<ProductDto> CreateProductAsync(CreateProductDto dto, int appUserId, bool isAdmin = false)
    {
        int vendorId;

        if (isAdmin && dto.VendorId.HasValue)
        {
            var vendor = await _vendorRepository.GetByIdAsync(dto.VendorId.Value)
                ?? throw new NotFoundException($"Vendor with ID {dto.VendorId.Value} not found.");
            vendorId = vendor.VendorId;
        }
        else
        {
            var vendor = await _vendorRepository.GetByAppUserIdAsync(appUserId)
                ?? throw new NotFoundException("Vendor profile not found for the authenticated user.");

            if (!vendor.IsActive)
            {
                throw new ForbiddenAccessException("Your vendor account is inactive. Please contact support.");
            }

            vendorId = vendor.VendorId;
        }

        var categoryExists = await _productRepository.CategoryExistsAsync(dto.ProductCategoryId);
        if (!categoryExists)
        {
            throw new NotFoundException($"Product category with ID {dto.ProductCategoryId} does not exist or is inactive.");
        }

        var product = new Product
        {
            VendorId = vendorId,
            ProductCategoryId = dto.ProductCategoryId,
            Name = dto.Name.Trim(),
            Description = dto.Description?.Trim(),
            Price = dto.Price,
            Unit = dto.Unit?.Trim(),
            StockQuantity = dto.StockQuantity,
            IsAvailable = dto.IsAvailable,
            CreatedAt = DateTime.UtcNow
        };

        if (dto.ImageUrls != null && dto.ImageUrls.Count > 0)
        {
            for (var i = 0; i < dto.ImageUrls.Count; i++)
            {
                var url = dto.ImageUrls[i]?.Trim();
                if (!string.IsNullOrWhiteSpace(url))
                {
                    product.ProductImages.Add(new ProductImage
                    {
                        ImageUrl = url,
                        IsPrimary = (i == 0),
                        SortOrder = i + 1,
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }
        }

        var created = await _productRepository.AddAsync(product);
        var fullProduct = await _productRepository.GetByIdAsync(created.ProductId);

        return MapToDto(fullProduct ?? created);
    }

    public async Task<ProductDto> UpdateProductAsync(int productId, UpdateProductDto dto, int appUserId, bool isAdmin = false)
    {
        var product = await _productRepository.GetByIdAsync(productId)
            ?? throw new NotFoundException($"Product with ID {productId} not found.");

        if (!isAdmin)
        {
            var vendor = await _vendorRepository.GetByAppUserIdAsync(appUserId);
            if (vendor == null || product.VendorId != vendor.VendorId)
            {
                throw new ForbiddenAccessException("You do not have permission to modify products from another store.");
            }
        }

        if (dto.ProductCategoryId.HasValue && dto.ProductCategoryId.Value != product.ProductCategoryId)
        {
            var categoryExists = await _productRepository.CategoryExistsAsync(dto.ProductCategoryId.Value);
            if (!categoryExists)
            {
                throw new NotFoundException($"Product category with ID {dto.ProductCategoryId.Value} does not exist or is inactive.");
            }
            product.ProductCategoryId = dto.ProductCategoryId.Value;
        }

        if (!string.IsNullOrWhiteSpace(dto.Name))
        {
            product.Name = dto.Name.Trim();
        }

        if (dto.Price.HasValue)
        {
            product.Price = dto.Price.Value;
        }

        if (dto.StockQuantity.HasValue)
        {
            product.StockQuantity = dto.StockQuantity.Value;
        }

        if (dto.Description != null)
        {
            product.Description = dto.Description.Trim();
        }

        if (dto.Unit != null)
        {
            product.Unit = dto.Unit.Trim();
        }

        if (dto.IsAvailable.HasValue)
        {
            product.IsAvailable = dto.IsAvailable.Value;
        }

        if (dto.ImageUrls != null)
        {
            product.ProductImages.Clear();
            for (var i = 0; i < dto.ImageUrls.Count; i++)
            {
                var url = dto.ImageUrls[i]?.Trim();
                if (!string.IsNullOrWhiteSpace(url))
                {
                    product.ProductImages.Add(new ProductImage
                    {
                        ImageUrl = url,
                        IsPrimary = (i == 0),
                        SortOrder = i + 1,
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }
        }

        product.UpdatedAt = DateTime.UtcNow;
        await _productRepository.UpdateAsync(product);

        var updated = await _productRepository.GetByIdAsync(productId);
        return MapToDto(updated ?? product);
    }

    public async Task DeleteProductAsync(int productId, int appUserId, bool isAdmin = false)
    {
        var product = await _productRepository.GetByIdAsync(productId)
            ?? throw new NotFoundException($"Product with ID {productId} not found.");

        if (!isAdmin)
        {
            var vendor = await _vendorRepository.GetByAppUserIdAsync(appUserId);
            if (vendor == null || product.VendorId != vendor.VendorId)
            {
                throw new ForbiddenAccessException("You do not have permission to delete products from another store.");
            }
        }

        await _productRepository.DeleteAsync(productId);
    }

    private static ProductDto MapToDto(Product p)
    {
        return new ProductDto
        {
            ProductId = p.ProductId,
            VendorId = p.VendorId,
            VendorName = p.Vendor?.ShopName ?? string.Empty,
            VendorAddress = p.Vendor?.Address ?? string.Empty,
            VendorPhone = p.Vendor?.PhoneNumber ?? string.Empty,
            VendorPincode = ExtractPincode(p.Vendor?.Address),
            ProductCategoryId = p.ProductCategoryId,
            CategoryName = p.ProductCategory?.CategoryName ?? string.Empty,
            Name = p.Name,
            Description = p.Description,
            Price = p.Price,
            Unit = p.Unit,
            StockQuantity = p.StockQuantity,
            IsAvailable = p.IsAvailable,
            CreatedAt = p.CreatedAt,
            UpdatedAt = p.UpdatedAt,
            Images = p.ProductImages?
                .OrderBy(i => i.SortOrder)
                .Select(i => new ProductImageDto
                {
                    ProductImageId = i.ProductImageId,
                    ImageUrl = i.ImageUrl,
                    IsPrimary = i.IsPrimary,
                    SortOrder = i.SortOrder
                }).ToList() ?? new List<ProductImageDto>()
        };
    }
    
    private static string ExtractPincode(string? address)
    {
        if (string.IsNullOrWhiteSpace(address)) return string.Empty;
        
        var match = System.Text.RegularExpressions.Regex.Match(address, @"\b\d{6}\b");
        return match.Success ? match.Value : string.Empty;
    }
}

