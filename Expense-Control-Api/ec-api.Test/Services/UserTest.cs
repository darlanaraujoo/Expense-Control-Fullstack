using ec_api.Application.DTOs;
using ec_api.Application.Exception;
using ec_api.Application.Services;
using ec_api.Application.Services.Interfaces;
using ec_api.DomainModel.Interfaces;
using Moq;

namespace ec_api.Test.Services;

public class UserTest
{
    private readonly IUserService _userService;
    private readonly Mock<IUserRepository> _userRepositoryMock;
    
    public UserTest()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _userService = new UserService(_userRepositoryMock.Object);
    }

    [Fact(DisplayName = "Teste com idade mínima para cadastro de usuário")]
    public async Task CreateAsync_ShouldThrowException_WhenUserIsYoungerThan7()
    {
        // Arrange
        var request = new UserCreateDto("User", 7);
        
        // Act & Assert
        var exception = await Assert.ThrowsAsync<CustomValidationException>(() => _userService.CreateAsync(request));
        Assert.Equal("Idade mínima permitida de 8 anos.", exception.Message);
    }
}