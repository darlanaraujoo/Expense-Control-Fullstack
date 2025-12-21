using ec_api.Application.DTOs;
using ec_api.Application.Exception;
using ec_api.Application.Services;
using ec_api.Application.Services.Interfaces;
using ec_api.DomainModel.Entities;
using ec_api.DomainModel.Enums;
using ec_api.DomainModel.Interfaces;
using Moq;

namespace ec_api.Test.Services;

public class TransactionTest
{
    private readonly ITransactionService _transactionService;
    private readonly Mock<ITransactionRepository> _transactionRepositoryMock;
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<ICategoryRepository> _categoryRepositoryMock;
    
    public TransactionTest()
    {
        _transactionRepositoryMock = new Mock<ITransactionRepository>();
        _userRepositoryMock = new Mock<IUserRepository>();
        _categoryRepositoryMock = new Mock<ICategoryRepository>();
        
        _transactionService = new TransactionService(
            _transactionRepositoryMock.Object, 
            _userRepositoryMock.Object, 
            _categoryRepositoryMock.Object);
    }
    

    [Fact(DisplayName = "Teste com idade mínima para cadastro de usuário")]
    public async Task CreateAsync_UserUnder18CreatingRecipe_ThrowsException()
    {
        // Arrange
        var request = new TransactionCreateDto("Test", 100, TypeEnum.Recipe, 1, 1);
        var user = new User { Id = 1, Age = 17, Name = "User" };
        
        _userRepositoryMock.Setup(x => x.FindByIdAsync(1)).ReturnsAsync(user);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<CustomValidationException>(() => _transactionService.CreateAsync(request));
        Assert.Equal("Menores de 18 só podem registrar despesas.", exception.Message);
    }
    
    [Fact(DisplayName = "Bloqueio de Receita em Categoria exclusiva de Despesa")]
    public async Task CreateAsync_RecipeWithExpenseCategory_ThrowsException()
    {
        // Arrange
        var request = new TransactionCreateDto("Test", 100, TypeEnum.Recipe, 1, 1);
        var user = new User { Id = 1, Age = 20, Name = "User" };
        var category = new Category { Id = 1, Purpose = PurposeEnum.Expense, Description = "Expense Cat" };
        
        _userRepositoryMock.Setup(x => x.FindByIdAsync(1)).ReturnsAsync(user);
        _categoryRepositoryMock.Setup(x => x.FindByIdAsync(1)).ReturnsAsync(category);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<CustomValidationException>(() => _transactionService.CreateAsync(request));
        Assert.Equal("Esta categoria é exclusiva para despesas.", exception.Message);
    }

    [Fact(DisplayName = "Bloqueio de Despesa em Categoria exclusiva de Receita")]
    public async Task CreateAsync_ExpenseWithRecipeCategory_ThrowsException()
    {
        // Arrange
        var request = new TransactionCreateDto("Test", 100, TypeEnum.Expense, 1, 1);
        var user = new User { Id = 1, Age = 20, Name = "User" };
        var category = new Category { Id = 1, Purpose = PurposeEnum.Recipe, Description = "Recipe Cat" };
        
        _userRepositoryMock.Setup(x => x.FindByIdAsync(1)).ReturnsAsync(user);
        _categoryRepositoryMock.Setup(x => x.FindByIdAsync(1)).ReturnsAsync(category);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<CustomValidationException>(() => _transactionService.CreateAsync(request));
        Assert.Equal("Esta categoria é exclusiva para receitas.", exception.Message);
    }
    
}