using ec_api.Application.DTOs;
using ec_api.Application.Exception;
using ec_api.Application.Services.Interfaces;
using ec_api.DomainModel.Entities;
using ec_api.DomainModel.Enums;
using ec_api.DomainModel.Interfaces;

namespace ec_api.Application.Services;

public class TransactionService : ITransactionService
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICategoryRepository _categoryRepository;
    public TransactionService(ITransactionRepository transactionRepository,
        IUserRepository userRepository, ICategoryRepository categoryRepository)
    {
        _transactionRepository = transactionRepository;
        _userRepository = userRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<TransactionResponseDto> CreateAsync(TransactionCreateDto request)
    {
        #region Validação de existência do usuário
        //Regra: A transação deve estar vinculada a um usuário válido.
        var user = await _userRepository.FindByIdAsync(request.UserId);
        if (user == null)
        {
            throw new CustomValidationException("Usuário não encontrado");
        }
        #endregion
        
        #region Validação de idade para receitas
        //Regra: Usuários menores de 18 anos não podem registrar receitas, apenas despesas.
        if (user.Age < 18 && request.Type == TypeEnum.Recipe)
        {
            throw new CustomValidationException("Menores de 18 só podem registrar despesas.");
        }
        #endregion
        
        #region Validação de existência da categoria
        //Regra: A transação deve pertencer a uma categoria existente.
        var category = await _categoryRepository.FindByIdAsync(request.CategoryId);
        if (category == null)
        {
            throw new CustomValidationException("Categoria não encontrada.");
        }
        #endregion
        
        #region Validação de consistência entre Tipo e Categoria
        //Regra: O tipo da transação (Receita/Despesa) deve corresponder ao propósito da categoria.
        if (request.Type == TypeEnum.Recipe && category.Purpose == PurposeEnum.Expense)
        {
            throw new CustomValidationException("Esta categoria é exclusiva para despesas.");
        }
        
        if (request.Type == TypeEnum.Expense && category.Purpose == PurposeEnum.Recipe)
        {
            throw new CustomValidationException("Esta categoria é exclusiva para receitas.");
        }
        #endregion
        
        var transaction = new Transaction
        {
            Description = request.Description,
            Value = request.Value,
            Type = request.Type,
            UserId = request.UserId,
            CategoryId = request.CategoryId,
            TransactionDate = DateTime.UtcNow
        };
        
        await _transactionRepository.CreateAsync(transaction);
        await _transactionRepository.SaveChangesAsync();

        return new TransactionResponseDto(
            transaction.Id,
            transaction.Description,
            transaction.Value,
            transaction.Type.ToString(),
            transaction.Category.Description,
            user.Name,
            transaction.TransactionDate);
    }

    public async Task<List<TransactionResponseDto>> ListAsync()
    {
        var transactions = await _transactionRepository.ListWithIncludeAsync();

        return transactions
            .Select(t => new TransactionResponseDto
            (t.Id, t.Description, t.Value, t.Type.ToString(), t.Category.Description, t.User.Name,
                t.TransactionDate))
            .ToList();
    }
    
}