using LocalCart.Api.DTOs.Vendors;
using LocalCart.Api.Exceptions;
using LocalCart.Api.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace LocalCart.Api.Controllers;

[ApiController]
[Route("vendors")]
public class VendorsController : ControllerBase
{
    private readonly IVendorService _vendorService;
    public VendorsController(IVendorService vendorService)
    {
        _vendorService = vendorService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<VendorDto>>> GetAll([FromQuery] bool includeInactive = false)
    {
        var vendors = await _vendorService.GetAllAsync(includeInactive);
        return Ok(vendors);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<VendorDto>> GetById(int id)
    {
        var vendor = await _vendorService.GetByIdAsync(id)
        ?? throw new NotFoundException($"Vendor with id {id} not found.");
        return Ok(vendor);
    }

    [HttpPost]
    public async Task<ActionResult<VendorDto>> Create([FromBody] CreateVendorDto dto)
    {
        var created = await _vendorService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.VendorId }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateVendorDto dto)
    {
        await _vendorService.UpdateAsync(id, dto);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _vendorService.DeleteAsync(id);
        return NoContent();
    }
}