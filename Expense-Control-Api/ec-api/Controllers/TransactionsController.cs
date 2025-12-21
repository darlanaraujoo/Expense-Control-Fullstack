using ec_api.Application.DTOs;
using ec_api.Application.Exception;
using ec_api.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ec_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _transactionService;
    public TransactionsController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    [HttpPost]
    public async Task<ActionResult<TransactionResponseDto>> Create(TransactionCreateDto request)
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
}