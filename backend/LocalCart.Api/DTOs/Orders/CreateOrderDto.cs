using System.ComponentModel.DataAnnotations;

namespace LocalCart.Api.DTOs.Orders;

public class CreateOrderDto
{
    [Required(ErrorMessage = "Customer name is required.")]
    [StringLength(120, ErrorMessage = "Customer name cannot exceed 120 characters.")]
    public string CustomerName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Customer email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email format.")]
    [StringLength(150, ErrorMessage = "Customer email cannot exceed 150 characters.")]
    public string CustomerEmail { get; set; } = string.Empty;

    [Required(ErrorMessage = "Customer phone number is required.")]
    [StringLength(20, ErrorMessage = "Phone number cannot exceed 20 characters.")]
    public string CustomerPhone { get; set; } = string.Empty;

    [Required(ErrorMessage = "Delivery method is required.")]
    [RegularExpression("^(Home Delivery|Pickup)$", ErrorMessage = "Delivery method must be 'Home Delivery' or 'Pickup'.")]
    public string DeliveryMethod { get; set; } = "Home Delivery";

    [StringLength(400, ErrorMessage = "Delivery address cannot exceed 400 characters.")]
    public string? DeliveryAddress { get; set; }

    [Required(ErrorMessage = "At least one order item is required.")]
    [MinLength(1, ErrorMessage = "Order must contain at least one item.")]
    public List<CreateOrderItemDto> Items { get; set; } = new();
}
