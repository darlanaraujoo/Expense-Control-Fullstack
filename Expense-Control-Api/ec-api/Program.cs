using System.Reflection;
using CrossCutting;
using ec_api.Infra.Context;
using ec_api.Infra.Seeding;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Scalar.AspNetCore;

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

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddControllers();
        builder.Services.AddSwaggerGen(options =>
        {
            #region Descrição Scalar

            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Expense Control API",
                Version = "v1",
                Description = """
                              # Expense Control API

                              API REST para **controle financeiro pessoal**, com gestão de usuários, categorias,
                              transações (receitas e despesas) e relatórios consolidados.

                              ## Autenticação

                              A maioria dos endpoints exige um token **JWT**. Siga os passos abaixo:

                              1. Execute `POST /api/Users/login` informando **e-mail** e **senha**.
                              2. Copie o valor do campo `token` retornado na resposta.
                              3. Envie o token no cabeçalho de todas as requisições protegidas:

                              ```
                              Authorization: Bearer {seu_token_jwt}
                              ```

                              ### Credenciais de desenvolvimento (seed)

                              | Campo  | Valor               |
                              |--------|---------------------|
                              | E-mail | `admin@email.com`   |
                              | Senha  | `admin123`          |

                              > Documentação interativa disponível em `/scalar`.
                              """
            });

            var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
            var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
            options.IncludeXmlComments(xmlPath);

            #endregion
            
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
        app.MapScalarApiReference("/scalar", options =>
        {
            options
                .WithTitle("Expense Control API")
                .WithOpenApiRoutePattern("/swagger/{documentName}/swagger.json");
        });

        app.MapControllers();
        app.MapHealthChecks("/health");
        await app.RunAsync();
    }
}
