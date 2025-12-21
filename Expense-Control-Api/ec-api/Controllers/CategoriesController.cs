using ec_api.Application.DTOs;
using ec_api.Application.Exception;
using ec_api.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ec_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;
    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }
    
    [HttpPost]
    public async Task<ActionResult<CategoryResponseDto>> Create([FromBody]CategoryCreateDto request)
    {
        try
        {
            var result = await _categoryService.CreateAsync(request);
            return CreatedAtAction(nameof(List), new { id = result.Id }, result);
        }
        catch (CustomValidationException e)
        {
            return BadRequest(e.Message);
        }
        catch (Exception e)
        {
            return Problem("Ocorreu um erro interno no servidor. Tente novamente mais tarde.");
        }
    }

    [HttpGet]
    public async Task<ActionResult<List<CategoryResponseDto>>> List()
    {
        try
        {
            var result = await _categoryService.ListAsync();
            return Ok(result);
        }
        catch (CustomValidationException e)
        {
            return BadRequest(e.Message);
        }
        catch (Exception)
        {
            return Problem("Ocorreu um erro interno no servidor. Tente novamente mais tarde.");
        }
    }
}