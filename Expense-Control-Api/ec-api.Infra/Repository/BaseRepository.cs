using ec_api.DomainModel.Interfaces;
using ec_api.Infra.Context;
using Microsoft.EntityFrameworkCore;


namespace ec_api.Infra.Repository;

public abstract class BaseRepository<T> : IBaseRepository<T> where T : class
{
    protected readonly ApplicationDbContext _context;
    protected BaseRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public Task<List<T>> ListAsync()
    { 
        return _context.Set<T>().AsNoTracking().ToListAsync();
    }

    public ValueTask<T?> FindByIdAsync(int id)
    {
         return _context.Set<T>().FindAsync(id);
    }

    public async Task CreateAsync(T entity)
    {
        await _context.Set<T>().AddAsync(entity);
    }

    public async Task CreateManyAsync(List<T> entities)
    {
        await _context.Set<T>().AddRangeAsync(entities);
    }
    
    public void Update(T entity)
    {
        _context.Set<T>().Update(entity);
    }

    public void UpdateMany(List<T> entities)
    {
        _context.Set<T>().UpdateRange(entities);
    }

    public void Delete(T entity)
    {
        _context.Set<T>().Remove(entity);
    }

    public void DeleteMany(List<T> entities)
    {
        _context.Set<T>().RemoveRange(entities);
    }
    
    public async Task<int> SaveChangesAsync() => await _context.SaveChangesAsync();
    
}