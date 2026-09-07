using LocalCart.Api.DTOs.ProductCategories;
using LocalCart.Api.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace LocalCart.Api.Controllers;

[ApiController]
[Route("product-categories")]
public class ProductCategoriesController : ControllerBase
{
    private readonly IProductCategoryServices _service;

    public ProductCategoriesController(IProductCategoryServices service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductCategoryDto>>> GetAll([FromQuery] bool includeInactive = false)
    {
        var categories = await _service.GetAllAsync(includeInactive);
        return Ok(categories);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductCategoryDto>> GetById(int id)
    {
        var category = await _service.GetByIdAsync(id);
        return Ok(category);
    }

    [HttpPost]
    public async Task<ActionResult<ProductCategoryDto>> Create([FromBody] CreateProductCategoryDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.ProductCategoryId }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateProductCategoryDto dto)
    {
        await _service.UpdateAsync(id, dto);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}