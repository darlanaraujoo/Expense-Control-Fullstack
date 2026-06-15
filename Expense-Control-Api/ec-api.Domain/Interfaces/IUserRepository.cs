using ec_api.DomainModel.Entities;

namespace ec_api.DomainModel.Interfaces;

public interface IUserRepository : IBaseRepository<User>
{
    Task<List<User>> ListWithTransactionsAsync();
    Task<User?> FindByEmailAsync(string email);
}