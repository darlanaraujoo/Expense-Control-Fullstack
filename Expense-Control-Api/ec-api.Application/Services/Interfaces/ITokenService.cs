using ec_api.DomainModel.Entities;

namespace ec_api.Application.Services.Interfaces;

public interface ITokenService
{
    string GenerateToken(User user);
}
