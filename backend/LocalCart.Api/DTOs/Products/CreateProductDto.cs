using System.ComponentModel.DataAnnotations;

namespace LocalCart.Api.DTOs.Products;

public class CreateProductDto
{
    [Required(ErrorMessage = "Product name is required.")]
    [StringLength(150, MinimumLength = 2, ErrorMessage = "Product name must be between 2 and 150 characters.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Product category is required.")]
    [Range(1, int.MaxValue, ErrorMessage = "A valid category ID must be specified.")]
    public int ProductCategoryId { get; set; }

    [Required(ErrorMessage = "Price is required.")]
    [Range(0.01, 1000000.00, ErrorMessage = "Price must be greater than zero.")]
    public decimal Price { get; set; }

    [Required(ErrorMessage = "Stock quantity is required.")]
    [Range(0, 1000000, ErrorMessage = "Stock quantity cannot be negative.")]
    public int StockQuantity { get; set; }

    [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters.")]
    public string? Description { get; set; }

    [StringLength(20, ErrorMessage = "Unit cannot exceed 20 characters.")]
    public string? Unit { get; set; }

    public bool IsAvailable { get; set; } = true;

    /// <summary>
    /// Optional: Admin users can specify a vendor ID. For Vendor users, VendorId is automatically inferred from their token.
    /// </summary>
    public int? VendorId { get; set; }

    /// <summary>
    /// Optional list of image URLs for the product.
    /// </summary>
    public List<string>? ImageUrls { get; set; }
}

