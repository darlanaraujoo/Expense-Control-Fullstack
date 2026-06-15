using ec_api.DomainModel.Entities;
using ec_api.Infra.Context;
using Microsoft.EntityFrameworkCore;

namespace ec_api.Infra.Seeding;

public static class DatabaseSeeder
{
    public const string AdminEmail = "admin@email.com";
    public const string AdminDefaultPassword = "admin123";

    public static async Task SeedAsync(ApplicationDbContext context)
    {
        await context.Database.MigrateAsync();

        var adminExists = await context.Users
            .AnyAsync(u => u.Email.ToLower() == AdminEmail);

        if (adminExists)
        {
            return;
        }

        context.Users.Add(new User
        {
            Name = "Administrador",
            Email = AdminEmail,
            Password = BCrypt.Net.BCrypt.HashPassword(AdminDefaultPassword),
            Age = 25,
            CreateAt = DateTime.UtcNow,
        });

        await context.SaveChangesAsync();
    }
}
