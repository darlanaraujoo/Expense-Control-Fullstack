using ec_api.DomainModel.Entities;

namespace ec_api.DomainModel.Interfaces;

public interface ICategoryRepository : IBaseRepository<Category>
{
    Task<List<Category>> ListWithUserAsync();
}