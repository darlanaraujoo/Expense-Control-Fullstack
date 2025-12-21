using CrossCutting;
using ec_api.Infra.Context;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        
        builder.Services.AddDbContext<ApplicationDbContext>(optionsBuilder =>
        {
            var connection = builder.Configuration.GetConnectionString("DefaultConnection");
            optionsBuilder.UseSqlite(connection,
                x => x.MigrationsAssembly("ec-api.Infra"));
            optionsBuilder.LogTo(Console.WriteLine, LogLevel.Warning);
        });
        
        builder.Services.AddHealthChecks()
            .AddSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
        
        builder.Services.AddControllers();
        builder.Services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "Controle de Gastos", Version = "v1" });
        });
        builder.Services.ConfigureServices();
        builder.Services.ConfigureCors();
        
        var app = builder.Build();
        
        app.UseCors("AllowReact");
        app.UseSwagger();
        app.UseSwaggerUI();


        app.MapControllers();
        app.MapHealthChecks("/health");
        app.Run();
    }
}