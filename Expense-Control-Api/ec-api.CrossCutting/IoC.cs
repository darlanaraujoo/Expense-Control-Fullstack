using ec_api.Application.Services;
using ec_api.Application.Services.Interfaces;
using ec_api.DomainModel.Interfaces;
using ec_api.Infra.Repository;
using Microsoft.Extensions.DependencyInjection;

namespace CrossCutting;

public static class IoC
{
    public static void ConfigureServices(this IServiceCollection services)
    {

        #region Services
        
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<ITransactionService, TransactionService>();
        
        #endregion

        #region Repositories

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        services.AddScoped<ITransactionRepository, TransactionRepository>();

        #endregion
        
    }
    
    public static void ConfigureCors(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("AllowReact",
                policy => policy.WithOrigins("http://localhost:5173")
                    .AllowAnyMethod()
                    .AllowAnyHeader());
        });
    }
}