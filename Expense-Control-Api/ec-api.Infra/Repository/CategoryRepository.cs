using ec_api.DomainModel.Entities;
using ec_api.DomainModel.Interfaces;
using ec_api.Infra.Context;
using Microsoft.EntityFrameworkCore;

namespace ec_api.Infra.Repository;

public class CategoryRepository : BaseRepository<Category>, ICategoryRepository
{
    public CategoryRepository(ApplicationDbContext context) : base(context){}
    
    public async Task<List<Category>> ListWithUserAsync()
    {
        return await _context.Categories
            .Include(c => c.User)
            .AsNoTracking()
            .ToListAsync();
    }
    
}