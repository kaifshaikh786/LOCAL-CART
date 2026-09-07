using System.ComponentModel.DataAnnotations;

namespace LocalCart.Api.DTOs.ProductCategories;

public class UpdateProductCategoryDto
{
    [Required(ErrorMessage = "Category name is required.")]
    [MaxLength(100, ErrorMessage = "Category name cannot exceed 100 characters.")]
    public string CategoryName { get; set; } = string.Empty;

    [MaxLength(300, ErrorMessage = "Description cannot exceed 300 characters.")]
    public string? Description { get; set; }

    public bool IsActive { get; set; }
}