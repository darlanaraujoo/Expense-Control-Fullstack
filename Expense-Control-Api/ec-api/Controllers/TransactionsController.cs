using ec_api.Application.DTOs;
using ec_api.Application.Exception;
using ec_api.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ec_api.Controllers;

/// <summary>
/// Gerencia transações financeiras (receitas e despesas) vinculadas a usuários e categorias.
/// </summary>
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionsController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    /// <summary>
    /// Registra uma nova receita ou despesa associada a um usuário e uma categoria.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<TransactionResponseDto>> Create([FromBody] TransactionCreateDto request)
    {
        try
        {
            var result = await _transactionService.CreateAsync(request);
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
    /// Lista todas as transações com detalhes de categoria, usuário e valor.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<TransactionResponseDto>>> List()
    {
        try
        {
            var result = await _transactionService.ListAsync();
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
    /// Atualiza os dados de uma transação existente pelo identificador.
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<TransactionResponseDto>> Update(int id, [FromBody] TransactionUpdateDto request)
    {
        try
        {
            var result = await _transactionService.UpdateAsync(id, request);
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
    /// Remove permanentemente uma transação financeira pelo identificador.
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _transactionService.DeleteAsync(id);
            return NoContent();
        }
        catch (CustomValidationException e)
        {
            return BadRequest(e.Message);
        }
        catch (Exception)
        {
            return Problem("Erro ao excluir transação.");
        }
    }
}
