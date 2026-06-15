using ec_api.Application.DTOs;

namespace ec_api.Application.Services.Interfaces;

public interface ICategoryService
{
    Task<CategoryResponseDto> CreateAsync(CategoryCreateDto request);
    Task<List<CategoryResponseDto>> ListAsync();
    Task<CategoryResponseDto> UpdateAsync(int id, CategoryUpdateDto request);
    Task DeleteAsync(int id);
}