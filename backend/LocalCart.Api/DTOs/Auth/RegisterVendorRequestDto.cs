using System.ComponentModel.DataAnnotations;

namespace LocalCart.Api.DTOs.Auth;

public class RegisterVendorRequestDto
{
    [Required(ErrorMessage = "Store name is required.")]
    [StringLength(150, MinimumLength = 2, ErrorMessage = "Store name must be between 2 and 150 characters.")]
    public string StoreName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Owner name is required.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Owner name must be between 2 and 100 characters.")]
    public string OwnerName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email format.")]
    [StringLength(150, ErrorMessage = "Email cannot exceed 150 characters.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Phone number is required.")]
    [Phone(ErrorMessage = "Invalid phone number format.")]
    [StringLength(15, MinimumLength = 7, ErrorMessage = "Phone number must be between 7 and 15 characters.")]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required.")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters.")]
    public string Password { get; set; } = string.Empty;

    [StringLength(300, ErrorMessage = "Address cannot exceed 300 characters.")]
    public string? Address { get; set; }

    [StringLength(100, ErrorMessage = "City cannot exceed 100 characters.")]
    public string? City { get; set; }
}

