using System.Globalization;
using LocalCart.Api.Data;
using LocalCart.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace LocalCart.Api.Services;

public static class CsvCatalogSeeder
{
    public static async Task SeedAsync(
        LocalCartDbContext dbContext,
        IConfiguration configuration,
        ILogger logger,
        CancellationToken cancellationToken = default)
    {
        var configuredPath = configuration["CatalogImport:FilePath"];
        if (string.IsNullOrWhiteSpace(configuredPath))
        {
            return;
        }

        var csvPath = Path.GetFullPath(configuredPath, Directory.GetCurrentDirectory());
        if (!File.Exists(csvPath))
        {
            logger.LogWarning("Catalog CSV was not found at {CsvPath}; skipping import.", csvPath);
            return;
        }

        var rows = ParseCsv(await File.ReadAllLinesAsync(csvPath, cancellationToken));
        if (rows.Count < 2)
        {
            logger.LogWarning("Catalog CSV at {CsvPath} has no data rows; skipping import.", csvPath);
            return;
        }

        var headers = rows[0]
            .Select((header, index) => new { Header = header.Trim(), Index = index })
            .ToDictionary(item => item.Header, item => item.Index, StringComparer.OrdinalIgnoreCase);

        var requiredHeaders = new[]
        {
            "Store Name", "Physical Address", "Store Contact Number", "Store Email",
            "Product Name", "Product Category", "Price (INR)", "Product Image URL"
        };

        if (requiredHeaders.Any(header => !headers.ContainsKey(header)))
        {
            logger.LogWarning("Catalog CSV is missing one or more required headers; skipping import.");
            return;
        }

        var importedProducts = 0;
        var importedVendors = 0;
        var importedCategories = 0;

        foreach (var row in rows.Skip(1).Where(row => row.Count > 0))
        {
            var storeName = Get(row, headers, "Store Name");
            var email = Get(row, headers, "Store Email");
            var productName = Get(row, headers, "Product Name");
            var categoryName = Get(row, headers, "Product Category");

            if (string.IsNullOrWhiteSpace(storeName) ||
                string.IsNullOrWhiteSpace(productName) ||
                string.IsNullOrWhiteSpace(categoryName))
            {
                continue;
            }

            var vendor = await dbContext.Vendors.FirstOrDefaultAsync(
                item => item.Email == email && item.DeletedAt == null,
                cancellationToken);

            if (vendor is null)
            {
                vendor = new Vendor
                {
                    ShopName = Limit(storeName, 150),
                    OwnerName = string.Empty,
                    PhoneNumber = NormalizePhone(Get(row, headers, "Store Contact Number")),
                    Email = Limit(email, 150),
                    Address = Limit(Get(row, headers, "Physical Address"), 300),
                    City = ExtractCity(Get(row, headers, "Physical Address")),
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                dbContext.Vendors.Add(vendor);
                await dbContext.SaveChangesAsync(cancellationToken);
                importedVendors++;
            }

            var category = await dbContext.ProductCategories.FirstOrDefaultAsync(
                item => item.CategoryName == categoryName,
                cancellationToken);

            if (category is null)
            {
                category = new ProductCategory
                {
                    CategoryName = Limit(categoryName, 100),
                    Description = "Imported catalog category",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                dbContext.ProductCategories.Add(category);
                await dbContext.SaveChangesAsync(cancellationToken);
                importedCategories++;
            }

            var productExists = await dbContext.Products.AnyAsync(
                item => item.VendorId == vendor.VendorId &&
                        item.Name == productName &&
                        item.DeletedAt == null,
                cancellationToken);

            if (productExists)
            {
                continue;
            }

            if (!decimal.TryParse(
                    Get(row, headers, "Price (INR)"),
                    NumberStyles.Number,
                    CultureInfo.InvariantCulture,
                    out var price))
            {
                continue;
            }

            var imageUrl = Get(row, headers, "Product Image URL");
            var product = new Product
            {
                VendorId = vendor.VendorId,
                ProductCategoryId = category.ProductCategoryId,
                Name = Limit(productName, 150),
                Description = $"Available at {vendor.ShopName}",
                Price = price,
                Unit = "1 piece",
                StockQuantity = Random.Shared.Next(50, 101),
                IsAvailable = true,
                CreatedAt = DateTime.UtcNow
            };

            if (!string.IsNullOrWhiteSpace(imageUrl))
            {
                product.ProductImages.Add(new ProductImage
                {
                    ImageUrl = Limit(imageUrl, 500),
                    IsPrimary = true,
                    SortOrder = 1,
                    CreatedAt = DateTime.UtcNow
                });
            }

            dbContext.Products.Add(product);
            importedProducts++;
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        logger.LogInformation(
            "Catalog import finished: {Vendors} vendors, {Categories} categories, {Products} products.",
            importedVendors,
            importedCategories,
            importedProducts);
    }

    private static string Get(
        IReadOnlyList<string> row,
        IReadOnlyDictionary<string, int> headers,
        string header)
    {
        return headers.TryGetValue(header, out var index) && index < row.Count
            ? row[index].Trim()
            : string.Empty;
    }

    private static string NormalizePhone(string value)
    {
        var digits = new string(value.Where(char.IsDigit).ToArray());
        return Limit($"+{digits}", 15);
    }

    private static string ExtractCity(string address)
    {
        var parts = address.Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);
        return parts.Length == 0 ? "Mumbai" : Limit(parts[^1].Split(' ', StringSplitOptions.RemoveEmptyEntries).FirstOrDefault() ?? "Mumbai", 100);
    }

    private static string Limit(string value, int maxLength)
    {
        return value.Length <= maxLength ? value : value[..maxLength];
    }

    private static List<List<string>> ParseCsv(IEnumerable<string> lines)
    {
        var rows = new List<List<string>>();
        var row = new List<string>();
        var field = new System.Text.StringBuilder();
        var quoted = false;

        foreach (var line in lines)
        {
            for (var index = 0; index < line.Length; index++)
            {
                var character = line[index];
                if (character == '"')
                {
                    if (quoted && index + 1 < line.Length && line[index + 1] == '"')
                    {
                        field.Append('"');
                        index++;
                    }
                    else
                    {
                        quoted = !quoted;
                    }
                }
                else if (character == ',' && !quoted)
                {
                    row.Add(field.ToString());
                    field.Clear();
                }
                else
                {
                    field.Append(character);
                }
            }

            if (!quoted)
            {
                row.Add(field.ToString());
                field.Clear();
                rows.Add(row);
                row = new List<string>();
            }
            else
            {
                field.Append('\n');
            }
        }

        return rows;
    }
}