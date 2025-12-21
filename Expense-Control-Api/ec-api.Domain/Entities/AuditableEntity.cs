namespace ec_api.DomainModel.Entities;

public abstract class AuditableEntity : Entity
{
    public DateTime CreateAt { get; set; }
    public DateTime? UpdateAt { get; set; }
}