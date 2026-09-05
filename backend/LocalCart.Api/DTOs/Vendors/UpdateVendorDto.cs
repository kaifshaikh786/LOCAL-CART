using System.ComponentModel.DataAnnotations;

namespace LocalCart.Api.DTOs.Vendors;

public class UpdateVendorDto
{
    [Required(ErrorMessage = "Shop name is required.")]
    [MaxLength(150, ErrorMessage = "Shop name cannot exceed 150 characters.")]
    public string ShopName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Owner name is required.")]
    [MaxLength(120, ErrorMessage = "Owner name cannot exceed 120 characters.")]
    public string OwnerName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Phone number is required.")]
    [Phone(ErrorMessage = "Invalid phone number format.")]
    [MaxLength(20, ErrorMessage = "Phone number cannot exceed 20 characters.")]
    public string PhoneNumber { get; set; } = string.Empty;

    [EmailAddress(ErrorMessage = "Invalid email format.")]
    [MaxLength(150, ErrorMessage = "Email cannot exceed 150 characters.")]
    public string? Email { get; set; }

    [Required(ErrorMessage = "Address is required.")]
    [MaxLength(400, ErrorMessage = "Address cannot exceed 400 characters.")]
    public string Address { get; set; } = string.Empty;

    [MaxLength(100, ErrorMessage = "City cannot exceed 100 characters.")]
    public string City { get; set; } = string.Empty;

    public bool IsActive { get; set; }
}