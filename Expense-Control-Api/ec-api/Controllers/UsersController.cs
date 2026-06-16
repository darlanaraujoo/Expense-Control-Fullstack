using ec_api.Application.DTOs;
using ec_api.Application.Exception;
using ec_api.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ec_api.Controllers;

/// <summary>
/// Gerencia usuários, autenticação JWT e relatórios financeiros consolidados.
/// </summary>
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    /// <summary>
    /// Autentica um usuário com e-mail e senha e retorna um token JWT.
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginRequestDto request)
    {
        try
        {
            var result = await _userService.LoginAsync(request);
            return Ok(result);
        }
        catch (UnauthorizedException e)
        {
            return Unauthorized(e.Message);
        }
        catch (Exception)
        {
            return Problem("Ocorreu um erro interno no servidor. Tente novamente mais tarde.");
        }
    }

    /// <summary>
    /// Cadastra um novo usuário no sistema (acesso público para registro inicial).
    /// </summary>
    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult<UserResponseDto>> Create([FromBody] UserCreateDto request)
    {
        try
        {
            var result = await _userService.CreateAsync(request);
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
    /// Lista todos os usuários cadastrados.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<UserResponseDto>>> List()
    {
        try
        {
            var result = await _userService.ListAsync();
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
    /// Retorna o relatório financeiro consolidado com totais de receitas, despesas e saldo por usuário.
    /// </summary>
    [HttpGet("report")]
    public async Task<ActionResult<UserReportResponseDto>> GetReport()
    {
        try
        {
            var result = await _userService.GetReportAsync();
            return Ok(result);
        }
        catch (Exception)
        {
            return Problem("Erro ao gerar o relatório de totais.");
        }
    }

    /// <summary>
    /// Atualiza os dados de um usuário existente pelo identificador.
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<UserResponseDto>> Update(int id, [FromBody] UserUpdateDto request)
    {
        try
        {
            var result = await _userService.UpdateAsync(id, request);
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
    /// Remove um usuário e todos os registros financeiros associados a ele.
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _userService.DeleteAsync(id);
            return NoContent();
        }
        catch (CustomValidationException e)
        {
            return BadRequest(e.Message);
        }
        catch (Exception)
        {
            return Problem("Erro ao deletar usuário.");
        }
    }
}
