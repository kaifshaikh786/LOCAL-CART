using System;
using System.Collections.Generic;

namespace LocalCart.Api.Entities;

public partial class AppUser
{
    public int AppUserId { get; set; }

    public string FullName { get; set; } = null!;

    public string? Email { get; set; }

    public string? PhoneNumber { get; set; }

    public string PasswordHash { get; set; } = null!;

    public string NormalizedEmail { get; set; } = null!;

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    public virtual ICollection<AppUserRole> AppUserRoles { get; set; } = new List<AppUserRole>();

    public virtual ICollection<Vendor> Vendors { get; set; } = new List<Vendor>();
}
