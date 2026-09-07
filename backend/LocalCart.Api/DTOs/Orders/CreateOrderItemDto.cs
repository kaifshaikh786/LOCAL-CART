using System.ComponentModel.DataAnnotations;

namespace LocalCart.Api.DTOs.Orders;

public class CreateOrderItemDto
{
    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "ProductId must be a valid positive number.")]
    public int ProductId { get; set; }

    [Required]
    [Range(1, 1000, ErrorMessage = "Quantity must be between 1 and 1000.")]
    public int Quantity { get; set; }
}
