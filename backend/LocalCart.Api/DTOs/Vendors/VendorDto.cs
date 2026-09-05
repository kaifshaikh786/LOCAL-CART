namespace LocalCart.Api.DTOs.Vendors;

public class VendorDto
{
    public int VendorId { get; set; }
    public string ShopName { get; set; } = string.Empty;
    public string OwnerName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}