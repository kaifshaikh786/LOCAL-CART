using System;
using System.Collections.Generic;
using LocalCart.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace LocalCart.Api.Data;

public partial class LocalCartDbContext : DbContext
{
    public LocalCartDbContext(DbContextOptions<LocalCartDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AppUser> AppUsers { get; set; }

    public virtual DbSet<AppUserRole> AppUserRoles { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderItem> OrderItems { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<ProductCategory> ProductCategories { get; set; }

    public virtual DbSet<ProductImage> ProductImages { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Vendor> Vendors { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AppUser>(entity =>
        {
            entity.HasKey(e => e.AppUserId).HasName("PK__AppUsers__FC65C730BB671720");

            entity.HasIndex(e => e.Email, "UQ__AppUsers__A9D10534C1E5D68A").IsUnique();

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Email).HasMaxLength(150);
            entity.Property(e => e.FullName).HasMaxLength(120);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.NormalizedEmail).HasMaxLength(150);
            entity.Property(e => e.PasswordHash).HasMaxLength(500);
            entity.Property(e => e.PhoneNumber).HasMaxLength(15);
        });

        modelBuilder.Entity<AppUserRole>(entity =>
        {
            entity.HasKey(e => new { e.AppUserId, e.RoleId });

            entity.Property(e => e.AssignedAt).HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.AppUser).WithMany(p => p.AppUserRoles)
                .HasForeignKey(d => d.AppUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_AppUserRoles_AppUsers");

            entity.HasOne(d => d.Role).WithMany(p => p.AppUserRoles)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_AppUserRoles_Roles");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.OrderId).HasName("PK__Orders__C3905BCF9BDFF23A");

            entity.HasIndex(e => e.OrderNumber, "UQ_Order_Number").IsUnique();

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.CustomerEmail).HasMaxLength(150);
            entity.Property(e => e.CustomerName).HasMaxLength(120);
            entity.Property(e => e.CustomerPhone).HasMaxLength(20);
            entity.Property(e => e.DeliveryAddress).HasMaxLength(400);
            entity.Property(e => e.DeliveryMethod).HasMaxLength(20);
            entity.Property(e => e.OrderNumber).HasMaxLength(40);
            entity.Property(e => e.OrderStatus)
                .HasMaxLength(30)
                .HasDefaultValue("Pending");
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(10, 2)");

            entity.HasOne(d => d.Vendor).WithMany(p => p.Orders)
                .HasForeignKey(d => d.VendorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Orders_Vendors");
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(e => e.OrderItemId).HasName("PK__OrderIte__57ED0681544DFFEE");

            entity.Property(e => e.LineTotal).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.ProductName).HasMaxLength(150);
            entity.Property(e => e.UnitPrice).HasColumnType("decimal(10, 2)");

            entity.HasOne(d => d.Order).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_OrderItems_Orders");

            entity.HasOne(d => d.Product).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_OrderItems_Products");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.ProductId).HasName("PK__Products__B40CC6CD8F9088EE");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsAvailable).HasDefaultValue(true);
            entity.Property(e => e.Name).HasMaxLength(150);
            entity.Property(e => e.Price).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.Unit).HasMaxLength(20);

            entity.HasOne(d => d.ProductCategory).WithMany(p => p.Products)
                .HasForeignKey(d => d.ProductCategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Products__Produc__6D0D32F4");

            entity.HasOne(d => d.Vendor).WithMany(p => p.Products)
                .HasForeignKey(d => d.VendorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Products__Vendor__6C190EBB");
        });

        modelBuilder.Entity<ProductCategory>(entity =>
        {
            entity.HasKey(e => e.ProductCategoryId).HasName("PK__ProductC__3224ECCE937993EC");

            entity.Property(e => e.CategoryName).HasMaxLength(100);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Description).HasMaxLength(120);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<ProductImage>(entity =>
        {
            entity.HasKey(e => e.ProductImageId).HasName("PK__ProductI__07B2B1B8923312DF");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.ImageUrl).HasMaxLength(500);
            entity.Property(e => e.SortOrder).HasDefaultValue(1);

            entity.HasOne(d => d.Product).WithMany(p => p.ProductImages)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProductImages_Products");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__Roles__8AFACE1A7CBB8E90");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Description).HasMaxLength(120);
            entity.Property(e => e.RoleName).HasMaxLength(50);
        });

        modelBuilder.Entity<Vendor>(entity =>
        {
            entity.HasKey(e => e.VendorId).HasName("PK__Vendors__FC8618F376626EAB");

            entity.Property(e => e.Address).HasMaxLength(300);
            entity.Property(e => e.City)
                .HasMaxLength(100)
                .HasDefaultValue("Mumbai");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Email).HasMaxLength(150);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.OwnerName).HasMaxLength(100);
            entity.Property(e => e.PhoneNumber).HasMaxLength(15);
            entity.Property(e => e.ShopName).HasMaxLength(150);

            entity.HasOne(d => d.AppUser).WithMany(p => p.Vendors)
                .HasForeignKey(d => d.AppUserId)
                .HasConstraintName("FK__Vendors__AppUser__47DBAE45");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
