using ec_api.DomainModel.Entities;

namespace ec_api.DomainModel.Interfaces;

public interface ITransactionRepository : IBaseRepository<Transaction>
{
    Task<List<Transaction>> ListWithIncludeAsync();
}