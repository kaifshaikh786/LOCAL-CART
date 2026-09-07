namespace LocalCart.Api.DTOs.Products;

public class ProductImageDto
{
    public int ProductImageId { get; set; }

    public string? ImageUrl { get; set; }

    public bool IsPrimary { get; set; }

    public int SortOrder { get; set; }
}

