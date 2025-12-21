using ec_api.DomainModel.Entities;
using ec_api.DomainModel.Interfaces;
using ec_api.Infra.Context;
using Microsoft.EntityFrameworkCore;

namespace ec_api.Infra.Repository;

public class TransactionRepository : BaseRepository<Transaction>, ITransactionRepository
{
    public TransactionRepository(ApplicationDbContext context): base(context) { }
    
    public async Task<List<Transaction>> ListWithIncludeAsync()
    {
        return await _context.Transactions
            .Include(t => t.User)
            .Include(t => t.Category)
            .AsNoTracking()
            .ToListAsync();
    }
}