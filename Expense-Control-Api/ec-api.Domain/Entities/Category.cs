using ec_api.DomainModel.Enums;

namespace ec_api.DomainModel.Entities;

public class Category : AuditableEntity
{
    public string Description { get; set; }
    public PurposeEnum Purpose { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
    public List<Transaction> Transactions { get; set; }
}