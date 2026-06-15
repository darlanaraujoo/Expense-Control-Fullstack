using ec_api.Application.Constants;
using ec_api.Application.DTOs;
using ec_api.Application.Exception;
using ec_api.Application.Services.Interfaces;
using ec_api.DomainModel.Entities;
using ec_api.DomainModel.Enums;
using ec_api.DomainModel.Interfaces;

namespace ec_api.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly ITokenService _tokenService;

    public UserService(IUserRepository userRepository, ITokenService tokenService)
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
    }

    public async Task<UserResponseDto> CreateAsync(UserCreateDto request)
    {
        if (request.Age <= 7)
        {
            throw new CustomValidationException("Idade mínima permitida de 8 anos.");
        }

        var existingUser = await _userRepository.FindByEmailAsync(request.Email);
        if (existingUser != null)
        {
            throw new CustomValidationException("E-mail já cadastrado.");
        }

        var user = new User
        {
            Name = request.Name,
            Email = request.Email.Trim().ToLowerInvariant(),
            Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Age = request.Age,
            CreateAt = DateTime.UtcNow,
        };

        await _userRepository.CreateAsync(user);
        await _userRepository.SaveChangesAsync();

        return MapToDto(user);
    }

    public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
    {
        var user = await _userRepository.FindByEmailAsync(request.Email.Trim());

        if (user == null)
        {
            throw new UnauthorizedException("E-mail ou senha incorretos.");
        }

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
        {
            throw new UnauthorizedException("E-mail ou senha incorretos.");
        }

        var token = _tokenService.GenerateToken(user);

        return new LoginResponseDto(
            token,
            new LoginUserDto(user.Id, user.Name, user.Email));
    }

    public async Task<List<UserResponseDto>> ListAsync()
    {
        var users = await _userRepository.ListAsync();
        return users.Select(MapToDto).ToList();
    }

    public async Task<UserResponseDto> UpdateAsync(int id, UserUpdateDto request)
    {
        var user = await _userRepository.FindByIdAsync(id);

        if (user == null)
        {
            throw new CustomValidationException("Usuário não encontrado.");
        }

        if (IsProtectedUser(user.Email))
        {
            throw new CustomValidationException("Este usuário não pode ser editado.");
        }

        if (request.Age <= 7)
        {
            throw new CustomValidationException("Idade mínima permitida de 8 anos.");
        }

        var email = request.Email.Trim().ToLowerInvariant();
        var existingUser = await _userRepository.FindByEmailAsync(email);
        if (existingUser != null && existingUser.Id != id)
        {
            throw new CustomValidationException("E-mail já cadastrado.");
        }

        user.Name = request.Name;
        user.Email = email;
        user.Age = request.Age;

        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            user.Password = BCrypt.Net.BCrypt.HashPassword(request.Password);
        }

        _userRepository.Update(user);
        await _userRepository.SaveChangesAsync();

        return MapToDto(user);
    }

    public async Task<UserReportResponseDto> GetReportAsync()
    {
        var users = await _userRepository.ListWithTransactionsAsync();

        var reportItems = users.Select(u => new UserReportItemDto(
            u.Name,
            u.Transactions.Where(t => t.Type == TypeEnum.Recipe).Sum(t => t.Value),
            u.Transactions.Where(t => t.Type == TypeEnum.Expense).Sum(t => t.Value),
            u.Transactions.Where(t => t.Type == TypeEnum.Recipe).Sum(t => t.Value) -
            u.Transactions.Where(t => t.Type == TypeEnum.Expense).Sum(t => t.Value)
        )).ToList();

        return new UserReportResponseDto(
            reportItems,
            reportItems.Sum(x => x.TotalRecipes),
            reportItems.Sum(x => x.TotalExpenses),
            reportItems.Sum(x => x.Balance)
        );
    }

    public async Task DeleteAsync(int id)
    {
        var user = await _userRepository.FindByIdAsync(id);

        if (user == null)
        {
            throw new CustomValidationException("Usuário não encontrado.");
        }

        if (IsProtectedUser(user.Email))
        {
            throw new CustomValidationException("Este usuário não pode ser excluído.");
        }

        _userRepository.Delete(user);
        await _userRepository.SaveChangesAsync();
    }

    private static bool IsProtectedUser(string email) =>
        email.Equals(AdminUserConstants.RootEmail, StringComparison.OrdinalIgnoreCase);

    private static UserResponseDto MapToDto(User user) =>
        new(user.Id, user.Name, user.Email, user.Age, user.CreateAt);
}
