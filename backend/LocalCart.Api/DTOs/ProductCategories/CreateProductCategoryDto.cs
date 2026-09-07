using System.ComponentModel.DataAnnotations;

namespace LocalCart.Api.DTOs.ProductCategories;

public class CreateProductCategoryDto
{
    [Required(ErrorMessage = "CategoryName is Missing.")]
    [MaxLength(100, ErrorMessage = "Category Name cannot exceeds 100 characters.")]
    public string CategoryName { get; set; } = string.Empty;

    [MaxLength(300, ErrorMessage = "Category Name cannot exceeds 300 characters.")]
    public string? Description { get; set; }
}