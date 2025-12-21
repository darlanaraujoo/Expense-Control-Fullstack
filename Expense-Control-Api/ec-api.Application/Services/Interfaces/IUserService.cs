using ec_api.Application.DTOs;

namespace ec_api.Application.Services.Interfaces;

public interface IUserService
{
    Task<UserResponseDto> CreateAsync(UserCreateDto request);
    Task<List<UserResponseDto>> ListAsync();
    Task<UserReportResponseDto> GetReportAsync();
    Task DeleteAsync(int id);
}