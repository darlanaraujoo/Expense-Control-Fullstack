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

    public CategoryService(ICategoryRepository categoryRepository, IUserRepository userRepository)
    {
        _categoryRepository = categoryRepository;
        _userRepository = userRepository;
    }

    public async Task<CategoryResponseDto> CreateAsync(CategoryCreateDto request)
    {
        var user = await _userRepository.FindByIdAsync(request.UserId);
        if (user == null)
        {
            throw new CustomValidationException("Usuário não encontrado");
        }

        var category = new Category
        {
            Description = request.Description,
            Purpose = request.Purpose,
            UserId = request.UserId,
            CreateAt = DateTime.UtcNow
        };

        await _categoryRepository.CreateAsync(category);
        await _categoryRepository.SaveChangesAsync();

        return MapToDto(category, user.Name);
    }

    public async Task<List<CategoryResponseDto>> ListAsync()
    {
        var categories = await _categoryRepository.ListWithUserAsync();

        return categories
            .Select(c => MapToDto(c, c.User.Name))
            .ToList();
    }

    public async Task<CategoryResponseDto> UpdateAsync(int id, CategoryUpdateDto request)
    {
        var category = await _categoryRepository.FindByIdAsync(id);
        if (category == null)
        {
            throw new CustomValidationException("Categoria não encontrada.");
        }

        var user = await _userRepository.FindByIdAsync(request.UserId);
        if (user == null)
        {
            throw new CustomValidationException("Usuário não encontrado");
        }

        category.Description = request.Description;
        category.Purpose = request.Purpose;
        category.UserId = request.UserId;

        _categoryRepository.Update(category);
        await _categoryRepository.SaveChangesAsync();

        return MapToDto(category, user.Name);
    }

    public async Task DeleteAsync(int id)
    {
        var category = await _categoryRepository.FindByIdAsync(id);
        if (category == null)
        {
            throw new CustomValidationException("Categoria não encontrada.");
        }

        if (await _categoryRepository.HasLinkedTransactionsAsync(id))
        {
            throw new CustomValidationException(
                "Não é possível excluir uma categoria que possui transações vinculadas.");
        }

        _categoryRepository.Delete(category);
        await _categoryRepository.SaveChangesAsync();
    }

    private static CategoryResponseDto MapToDto(Category category, string userName) =>
        new(
            category.Id,
            category.Description,
            category.Purpose.ToString(),
            category.CreateAt,
            userName,
            category.UserId);
}
