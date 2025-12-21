using ec_api.Application.DTOs;

namespace ec_api.Application.Services.Interfaces;

public interface ITransactionService
{
    Task<TransactionResponseDto> CreateAsync(TransactionCreateDto request);
    Task<List<TransactionResponseDto>> ListAsync();
}