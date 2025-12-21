using ec_api.DomainModel.Enums;

namespace ec_api.DomainModel.Entities;

public class Transaction : Entity
{
    public string Description { get; set; }
    public decimal Value { get; set; }
    public TypeEnum Type { get; set; }
    public int CategoryId { get; set; }
    public int UserId { get; set; }
    public DateTime TransactionDate { get; set; }
    
    public virtual Category Category { get; set; }
    public virtual User User { get; set; }
}