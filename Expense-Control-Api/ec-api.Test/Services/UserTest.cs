using ec_api.Application.DTOs;
using ec_api.Application.Exception;
using ec_api.Application.Services;
using ec_api.Application.Services.Interfaces;
using ec_api.DomainModel.Interfaces;
using Moq;
using UnauthorizedException = ec_api.Application.Exception.UnauthorizedException;

namespace ec_api.Test.Services;

public class UserTest
{
    private readonly IUserService _userService;
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<ITokenService> _tokenServiceMock;
    
    public UserTest()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _tokenServiceMock = new Mock<ITokenService>();
        _userService = new UserService(_userRepositoryMock.Object, _tokenServiceMock.Object);
    }

    [Fact(DisplayName = "Teste com idade mínima para cadastro de usuário")]
    public async Task CreateAsync_ShouldThrowException_WhenUserIsYoungerThan7()
    {
        // Arrange
        var request = new UserCreateDto("User", 7, "user@test.com", "senha123");
        
        // Act & Assert
        var exception = await Assert.ThrowsAsync<CustomValidationException>(() => _userService.CreateAsync(request));
        Assert.Equal("Idade mínima permitida de 8 anos.", exception.Message);
    }

    [Fact(DisplayName = "Login deve falhar quando credenciais são inválidas")]
    public async Task LoginAsync_ShouldThrowUnauthorized_WhenUserNotFound()
    {
        // Arrange
        _userRepositoryMock
            .Setup(r => r.FindByEmailAsync("inexistente@test.com"))
            .ReturnsAsync((ec_api.DomainModel.Entities.User?)null);

        var request = new LoginRequestDto("inexistente@test.com", "senha123");

        // Act & Assert
        var exception = await Assert.ThrowsAsync<UnauthorizedException>(() => _userService.LoginAsync(request));
        Assert.Equal("E-mail ou senha incorretos.", exception.Message);
    }
}