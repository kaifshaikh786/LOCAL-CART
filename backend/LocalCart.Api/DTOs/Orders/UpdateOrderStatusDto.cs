using System.ComponentModel.DataAnnotations;

namespace LocalCart.Api.DTOs.Orders;

public class UpdateOrderStatusDto
{
    [Required(ErrorMessage = "Order status is required.")]
    [RegularExpression("^(Pending|Accepted|ReadyForPickup|Completed|Cancelled)$", 
        ErrorMessage = "Invalid status. Allowed values: Pending, Accepted, ReadyForPickup, Completed, Cancelled.")]
    public string Status { get; set; } = string.Empty;
}
