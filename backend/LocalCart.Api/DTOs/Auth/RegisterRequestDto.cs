using System.ComponentModel.DataAnnotations;

namespace LocalCart.Api.DTOs.Auth;

public class RegisterRequestDto
{
    [Required(ErrorMessage = "Full name is required.")]
    [StringLength(120, MinimumLength = 2, ErrorMessage = "Full name must be between 2 and 120 characters.")]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email format.")]
    [StringLength(150, ErrorMessage = "Email cannot exceed 150 characters.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required.")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters.")]
    public string Password { get; set; } = string.Empty;

    [Phone(ErrorMessage = "Invalid phone number format.")]
    [StringLength(15, ErrorMessage = "Phone number cannot exceed 15 characters.")]
    public string? PhoneNumber { get; set; }

    public string? Role { get; set; } = "Customer";

    [StringLength(150, ErrorMessage = "Shop name cannot exceed 150 characters.")]
    public string? ShopName { get; set; }

    [StringLength(300, ErrorMessage = "Address cannot exceed 300 characters.")]
    public string? Address { get; set; }

    [StringLength(100, ErrorMessage = "City cannot exceed 100 characters.")]
    public string? City { get; set; }
}

