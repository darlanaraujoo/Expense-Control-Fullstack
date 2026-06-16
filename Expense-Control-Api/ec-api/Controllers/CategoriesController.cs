using ec_api.Application.DTOs;
using ec_api.Application.Exception;
using ec_api.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ec_api.Controllers;

/// <summary>
/// Gerencia categorias financeiras vinculadas a usuários (receita, despesa ou ambas).
/// </summary>
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    /// <summary>
    /// Cria uma nova categoria financeira para classificar transações.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<CategoryResponseDto>> Create([FromBody] CategoryCreateDto request)
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
        catch (Exception)
        {
            return Problem("Ocorreu um erro interno no servidor. Tente novamente mais tarde.");
        }
    }

    /// <summary>
    /// Lista todas as categorias cadastradas com o responsável de cada uma.
    /// </summary>
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

    /// <summary>
    /// Atualiza a descrição, finalidade ou responsável de uma categoria existente.
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<CategoryResponseDto>> Update(int id, [FromBody] CategoryUpdateDto request)
    {
        try
        {
            var result = await _categoryService.UpdateAsync(id, request);
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

    /// <summary>
    /// Exclui uma categoria. A operação é bloqueada se houver transações vinculadas.
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _categoryService.DeleteAsync(id);
            return NoContent();
        }
        catch (CustomValidationException e)
        {
            return BadRequest(e.Message);
        }
        catch (Exception)
        {
            return Problem("Erro ao excluir categoria.");
        }
    }
}
