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

    public TransactionService(
        ITransactionRepository transactionRepository,
        IUserRepository userRepository,
        ICategoryRepository categoryRepository)
    {
        _transactionRepository = transactionRepository;
        _userRepository = userRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<TransactionResponseDto> CreateAsync(TransactionCreateDto request)
    {
        var (user, category) = await ValidateTransactionAsync(request.UserId, request.CategoryId, request.Type);

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

        return MapToDto(transaction, category.Description, user.Name);
    }

    public async Task<List<TransactionResponseDto>> ListAsync()
    {
        var transactions = await _transactionRepository.ListWithIncludeAsync();

        return transactions
            .Select(t => MapToDto(t, t.Category.Description, t.User.Name))
            .ToList();
    }

    public async Task<TransactionResponseDto> UpdateAsync(int id, TransactionUpdateDto request)
    {
        var transaction = await _transactionRepository.FindByIdAsync(id);
        if (transaction == null)
        {
            throw new CustomValidationException("Transação não encontrada.");
        }

        var (user, category) = await ValidateTransactionAsync(request.UserId, request.CategoryId, request.Type);

        transaction.Description = request.Description;
        transaction.Value = request.Value;
        transaction.Type = request.Type;
        transaction.UserId = request.UserId;
        transaction.CategoryId = request.CategoryId;

        _transactionRepository.Update(transaction);
        await _transactionRepository.SaveChangesAsync();

        return MapToDto(transaction, category.Description, user.Name);
    }

    public async Task DeleteAsync(int id)
    {
        var transaction = await _transactionRepository.FindByIdAsync(id);
        if (transaction == null)
        {
            throw new CustomValidationException("Transação não encontrada.");
        }

        _transactionRepository.Delete(transaction);
        await _transactionRepository.SaveChangesAsync();
    }

    private async Task<(User user, Category category)> ValidateTransactionAsync(
        int userId,
        int categoryId,
        TypeEnum type)
    {
        var user = await _userRepository.FindByIdAsync(userId);
        if (user == null)
        {
            throw new CustomValidationException("Usuário não encontrado");
        }

        if (user.Age < 18 && type == TypeEnum.Recipe)
        {
            throw new CustomValidationException("Menores de 18 só podem registrar despesas.");
        }

        var category = await _categoryRepository.FindByIdAsync(categoryId);
        if (category == null)
        {
            throw new CustomValidationException("Categoria não encontrada.");
        }

        if (type == TypeEnum.Recipe && category.Purpose == PurposeEnum.Expense)
        {
            throw new CustomValidationException("Esta categoria é exclusiva para despesas.");
        }

        if (type == TypeEnum.Expense && category.Purpose == PurposeEnum.Recipe)
        {
            throw new CustomValidationException("Esta categoria é exclusiva para receitas.");
        }

        return (user, category);
    }

    private static TransactionResponseDto MapToDto(Transaction transaction, string categoryName, string userName) =>
        new(
            transaction.Id,
            transaction.Description,
            transaction.Value,
            transaction.Type.ToString(),
            categoryName,
            userName,
            transaction.TransactionDate,
            transaction.UserId,
            transaction.CategoryId);
}
