using ec_api.Application.DTOs;
using ec_api.Application.Exception;
using ec_api.Application.Services.Interfaces;
using ec_api.DomainModel.Entities;
using ec_api.DomainModel.Interfaces;

namespace ec_api.Application.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IUserRepository _userRepository;
    public CategoryService(ICategoryRepository categoryRepository,
        IUserRepository userRepository)
    {
        _categoryRepository = categoryRepository;
        _userRepository = userRepository;
    }

    public async Task<CategoryResponseDto> CreateAsync(CategoryCreateDto request)
    {
        #region Validação de existência do usuário
        
        var user = await _userRepository.FindByIdAsync(request.UserId);
        if (user == null)
        {
            throw new CustomValidationException("Usuário não encontrado");
        }
        #endregion
        
        var category = new Category
        {
            Description = request.Description,
            Purpose = request.Purpose,
            UserId = request.UserId,
            CreateAt = DateTime.UtcNow
        };

        await _categoryRepository.CreateAsync(category);
        await _categoryRepository.SaveChangesAsync();
        
        return new CategoryResponseDto(
            category.Id,
            category.Description,
            category.Purpose.ToString(),
            category.CreateAt,
            user.Name);
    }

    public async Task<List<CategoryResponseDto>> ListAsync()
    {
        var categories = await _categoryRepository.ListWithUserAsync();

        return categories
            .Select(c => new CategoryResponseDto
                (c.Id, c.Description, c.Purpose.ToString(), c.CreateAt, c.User.Name))
            .ToList();
    }
}