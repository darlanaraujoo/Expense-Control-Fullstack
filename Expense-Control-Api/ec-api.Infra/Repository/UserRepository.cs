using ec_api.DomainModel.Entities;
using ec_api.DomainModel.Interfaces;
using ec_api.Infra.Context;
using Microsoft.EntityFrameworkCore;

namespace ec_api.Infra.Repository;

public class UserRepository : BaseRepository<User>, IUserRepository
{
    public UserRepository(ApplicationDbContext context) : base(context) {}
    
    public async Task<List<User>> ListWithTransactionsAsync()
    {
        return await _context.Users
            .Include(c => c.Transactions)
            .AsNoTracking()
            .ToListAsync();
    }
    
}