namespace LocalCart.Api.DTOs.Products;

public class ProductDto
{
    public int ProductId { get; set; }

    public int VendorId { get; set; }

    public string VendorName { get; set; } = string.Empty;

    public int ProductCategoryId { get; set; }

    public string CategoryName { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public decimal Price { get; set; }

    public string? Unit { get; set; }

    public int StockQuantity { get; set; }

    public bool IsAvailable { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public List<ProductImageDto> Images { get; set; } = new();
}

