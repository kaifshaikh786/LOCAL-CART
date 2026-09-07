namespace LocalCart.Api.DTOs.Orders;

public class OrderDto
{
    public int OrderId { get; set; }

    public string OrderNumber { get; set; } = string.Empty;

    public int VendorId { get; set; }

    public string VendorShopName { get; set; } = string.Empty;

    public string CustomerName { get; set; } = string.Empty;

    public string CustomerEmail { get; set; } = string.Empty;

    public string CustomerPhone { get; set; } = string.Empty;

    public string DeliveryMethod { get; set; } = string.Empty;

    public string? DeliveryAddress { get; set; }

    public decimal TotalAmount { get; set; }

    public string OrderStatus { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public List<OrderItemDto> Items { get; set; } = new();
}
