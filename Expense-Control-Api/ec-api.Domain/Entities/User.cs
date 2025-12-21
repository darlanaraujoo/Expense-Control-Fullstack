namespace ec_api.DomainModel.Entities;

public class User : AuditableEntity
{
    public string Name { get; set; }
    public int Age { get; set; }
    
    public List<Transaction> Transactions { get; set; }
}