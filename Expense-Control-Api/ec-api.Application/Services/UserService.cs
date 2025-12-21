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

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserResponseDto> CreateAsync(UserCreateDto request)
    {
        #region Validação de idade mínima permissiva
        if (request.Age <= 7)
        {
            throw new CustomValidationException("Idade mínima permitida de 8 anos.");
        }
        #endregion

        var user = new User 
        { 
            Name = request.Name, 
            Age = request.Age,
            CreateAt = DateTime.UtcNow
        };
        
        await _userRepository.CreateAsync(user);
        await _userRepository.SaveChangesAsync();
        
        return new UserResponseDto(
            user.Id,
            user.Name,
            user.Age,
            user.CreateAt);
    }

    public async Task<List<UserResponseDto>> ListAsync()
    {
        var users = await _userRepository.ListAsync();
        
        return users.Select(u => new UserResponseDto
            (u.Id, u.Name, u.Age, u.CreateAt))
            .ToList();
    }
    
    public async Task<UserReportResponseDto> GetReportAsync()
    {
        var users = await _userRepository.ListWithTransactionsAsync();

        #region Cálculo de totais por usuário
        // Lógica: Calcula receitas, despesas e saldo para cada usuário individualmente.
        var reportItems = users.Select(u => new UserReportItemDto(
            u.Name,
            u.Transactions.Where(t => t.Type == TypeEnum.Recipe).Sum(t => t.Value),
            u.Transactions.Where(t => t.Type == TypeEnum.Expense).Sum(t => t.Value),
            u.Transactions.Where(t => t.Type == TypeEnum.Recipe).Sum(t => t.Value) - 
            u.Transactions.Where(t => t.Type == TypeEnum.Expense).Sum(t => t.Value)
        )).ToList();
        #endregion

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

        #region Validar se usuário existe para realizar ação de exclusão

        if (user == null)
        {
            throw new CustomValidationException("Usuário não encontrado.");
        }

        #endregion

        _userRepository.Delete(user);
        await _userRepository.SaveChangesAsync();
    }
}