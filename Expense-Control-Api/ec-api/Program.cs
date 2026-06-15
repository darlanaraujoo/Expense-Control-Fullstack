using CrossCutting;
using ec_api.Infra.Context;
using ec_api.Infra.Seeding;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var dbPath = Path.Combine(builder.Environment.ContentRootPath, "gastos.db");
        var connectionString = $"Data Source={dbPath}";

        builder.Services.AddDbContext<ApplicationDbContext>(optionsBuilder =>
        {
            optionsBuilder.UseSqlite(connectionString,
                x => x.MigrationsAssembly("ec-api.Infra"));
            optionsBuilder.LogTo(Console.WriteLine, LogLevel.Warning);
        });

        builder.Services.AddHealthChecks()
            .AddSqlite(connectionString);

        builder.Services.AddControllers();
        builder.Services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "Controle de Gastos", Version = "v1" });
        });
        builder.Services.ConfigureServices();
        builder.Services.ConfigureJwtAuthentication(builder.Configuration);
        builder.Services.ConfigureCors();

        var app = builder.Build();

        using (var scope = app.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            await DatabaseSeeder.SeedAsync(db);
        }

        app.UseCors("AllowReact");
        app.UseAuthentication();
        app.UseAuthorization();
        app.UseSwagger();
        app.UseSwaggerUI();

        app.MapControllers();
        app.MapHealthChecks("/health");
        await app.RunAsync();
    }
}
