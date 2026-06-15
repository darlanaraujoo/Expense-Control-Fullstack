using ec_api.DomainModel.Entities;
using Microsoft.EntityFrameworkCore;

namespace ec_api.Infra.Context;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }
    
    public DbSet<User> Users { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Transaction> Transactions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        //Configuração da entidade User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id)
                .ValueGeneratedOnAdd();
            
            entity.Property(x => x.Name).
                HasMaxLength(255)
                .IsRequired();
            entity.HasIndex(x => x.Name)
                .IsUnique();

            entity.Property(x => x.Email)
                .HasMaxLength(255)
                .IsRequired();
            entity.HasIndex(x => x.Email)
                .IsUnique();

            entity.Property(x => x.Password)
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(x => x.Age)
                .IsRequired();
            
            entity.Property(x => x.CreateAt)
                .IsRequired()
                .ValueGeneratedOnAdd();
        
            entity.Property(x => x.UpdateAt)
                .ValueGeneratedOnAddOrUpdate();
        });
        
        //Configuração da entidade Category
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id)
                .ValueGeneratedOnAdd();

            entity.Property(x => x.Description)
                .HasMaxLength(255)
                .IsRequired();
            
            entity.Property(x => x.Purpose)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();
            
            entity.Property(x => x.CreateAt)
                .IsRequired()
                .ValueGeneratedOnAdd();
        
            entity.Property(x => x.UpdateAt)
                .ValueGeneratedOnAddOrUpdate();
            
            entity.HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

        });
        
        //Configuração da entidade Transaction
        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id)
                .ValueGeneratedOnAdd();
            
            entity.Property(x => x.Description)
                .HasMaxLength(255)
                .IsRequired();
            
            entity.Property(x => x.Value)
                .IsRequired();
            
            entity.Property(e => e.Type)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();
            
            entity.HasOne(t => t.User)
                .WithMany(u => u.Transactions)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(x => x.UserId);

            entity.HasOne(t => t.Category)
                .WithMany(c => c.Transactions)
                .HasForeignKey(t => t.CategoryId);
            entity.HasIndex(x => x.CategoryId);
            
            entity.Property(x => x.TransactionDate)
                .IsRequired()
                .ValueGeneratedOnAdd();
            
        });

    }
}