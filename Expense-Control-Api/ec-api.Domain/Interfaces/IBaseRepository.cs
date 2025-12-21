namespace ec_api.DomainModel.Interfaces;

public interface IBaseRepository<T> where T : class
{
    Task<List<T>> ListAsync();
    ValueTask<T?> FindByIdAsync(int id);
    Task CreateAsync(T entity);
    Task CreateManyAsync(List<T> entities);
    void Update(T entity);
    void UpdateMany(List<T> entities);
    void Delete(T entity);
    void DeleteMany(List<T> entities);
    Task<int> SaveChangesAsync();
}