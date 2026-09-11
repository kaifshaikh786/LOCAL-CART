using System.Text;
using LocalCart.Api.Data;
using LocalCart.Api.Interfaces.Repositories;
using LocalCart.Api.Interfaces.Services;
using LocalCart.Api.Middleware;
using LocalCart.Api.Repositories;
using LocalCart.Api.Services;
using LocalCart.Api.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

builder.Logging.SetMinimumLevel(LogLevel.Information);

builder.Logging.AddFilter("Microsoft.EntityFrameworkCore", LogLevel.Warning);
builder.Logging.AddFilter("Microsoft.AspNetCore", LogLevel.Warning);

builder.Logging.AddSimpleConsole(options =>
{
    options.SingleLine = true;
    options.TimestampFormat = "HH:mm:ss ";
});

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();

// JWT Settings Configuration
var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>() ?? new JwtSettings();
if (Encoding.UTF8.GetByteCount(jwtSettings.SecretKey) < 32 && builder.Environment.IsDevelopment())
{
    jwtSettings.SecretKey = "LocalCart-development-key-change-before-production-2026";
}
builder.Services.Configure<JwtSettings>(options =>
{
    options.Issuer = jwtSettings.Issuer;
    options.Audience = jwtSettings.Audience;
    options.SecretKey = jwtSettings.SecretKey;
    options.AccessTokenMinutes = jwtSettings.AccessTokenMinutes;
    options.RefreshTokenDays = jwtSettings.RefreshTokenDays;
});
var secretKey = Encoding.UTF8.GetBytes(jwtSettings.SecretKey);

// Authentication & JWT Bearer Configuration
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(secretKey),
        ValidateIssuer = !string.IsNullOrWhiteSpace(jwtSettings.Issuer),
        ValidIssuer = jwtSettings.Issuer,
        ValidateAudience = !string.IsNullOrWhiteSpace(jwtSettings.Audience),
        ValidAudience = jwtSettings.Audience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

builder.Services.AddDbContext<LocalCartDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    if (string.IsNullOrWhiteSpace(connectionString) || connectionString.StartsWith("["))
    {
        var localDatabasePath = Path.Combine(builder.Environment.ContentRootPath, "localcart.db");
        options.UseSqlite($"Data Source={localDatabasePath}");
    }
    else
    {
        options.UseSqlServer(connectionString,
            sqloptions => sqloptions.UseQuerySplittingBehavior(QuerySplittingBehavior.SingleQuery));
    }
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

// Application Services & Repositories
builder.Services.AddScoped<IPasswordHasherService, PasswordHasherService>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddScoped<IProductCategoryRepository, ProductCategoryRepository>();
builder.Services.AddScoped<IProductCategoryServices, ProductCategoryServices>();

builder.Services.AddScoped<IVendorRepository, VendorRepository>();
builder.Services.AddScoped<IVendorService, VendorService>();

builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();

builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IOrderService, OrderService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<LocalCartDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>()
        .CreateLogger("CatalogImport");
    try
    {
        await dbContext.Database.EnsureCreatedAsync();
        var requiredRoles = new[] { "Customer", "Vendor", "Admin" };
        foreach (var roleName in requiredRoles)
        {
            if (!await dbContext.Roles.AnyAsync(role => role.RoleName == roleName))
            {
                dbContext.Roles.Add(new LocalCart.Api.Entities.Role
                {
                    RoleName = roleName,
                    Description = $"LocalCart {roleName} role",
                    CreatedAt = DateTime.UtcNow
                });
            }
        }
        await dbContext.SaveChangesAsync();
        await CsvCatalogSeeder.SeedAsync(dbContext, builder.Configuration, logger);
    }
    catch (Exception exception)
    {
        logger.LogError(
            exception,
            "Catalog import was skipped because the database is unavailable or not configured.");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<GlobalExceptionMiddleware>();
app.MapControllers();
app.Run();