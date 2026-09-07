using System.Security.Claims;
using LocalCart.Api.DTOs.Products;
using LocalCart.Api.Exceptions;
using LocalCart.Api.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LocalCart.Api.Controllers;

[ApiController]
[Route("products")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetAll(
        [FromQuery] int? vendorId = null,
        [FromQuery] int? categoryId = null,
        [FromQuery] string? search = null,
        [FromQuery] bool includeUnavailable = false)
    {
        var products = await _productService.GetAllAsync(vendorId, categoryId, search, includeUnavailable);
        return Ok(products);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductDto>> GetById(int id)
    {
        var product = await _productService.GetByIdAsync(id)
            ?? throw new NotFoundException($"Product with ID {id} not found.");

        return Ok(product);
    }

    [Authorize(Roles = "Vendor,Admin")]
    [HttpGet("my-products")]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetMyProducts()
    {
        var appUserId = GetCurrentAppUserId();
        var products = await _productService.GetMyProductsAsync(appUserId);
        return Ok(products);
    }

    [Authorize(Roles = "Vendor,Admin")]
    [HttpPost]
    public async Task<ActionResult<ProductDto>> Create([FromBody] CreateProductDto dto)
    {
        var appUserId = GetCurrentAppUserId();
        var isAdmin = User.IsInRole("Admin");

        var created = await _productService.CreateProductAsync(dto, appUserId, isAdmin);
        return CreatedAtAction(nameof(GetById), new { id = created.ProductId }, created);
    }

    [Authorize(Roles = "Vendor,Admin")]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<ProductDto>> Update(int id, [FromBody] UpdateProductDto dto)
    {
        var appUserId = GetCurrentAppUserId();
        var isAdmin = User.IsInRole("Admin");

        var updated = await _productService.UpdateProductAsync(id, dto, appUserId, isAdmin);
        return Ok(updated);
    }

    [Authorize(Roles = "Vendor,Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var appUserId = GetCurrentAppUserId();
        var isAdmin = User.IsInRole("Admin");

        await _productService.DeleteProductAsync(id, appUserId, isAdmin);
        return NoContent();
    }

    private int GetCurrentAppUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(claim) || !int.TryParse(claim, out var appUserId))
        {
            throw new UnauthorizedException("User identity could not be verified from token.");
        }

        return appUserId;
    }
}

