using System;
using System.Collections.Generic;

namespace LocalCart.Api.Entities;

public partial class Vendor
{
    public int VendorId { get; set; }

    public int? AppUserId { get; set; }

    public string ShopName { get; set; } = null!;

    public string OwnerName { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;

    public string? Email { get; set; }

    public string Address { get; set; } = null!;

    public string City { get; set; } = null!;

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    public virtual AppUser? AppUser { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
