using ec_api.DomainModel.Enums;

namespace ec_api.Application.DTOs;


public record CategoryResponseDto(
    int Id,
    string Description,
    string Purpose,
    DateTime CreateAt,
    string UserName,
    int UserId);

public record CategoryCreateDto(string Description, PurposeEnum Purpose, int UserId);

public record CategoryUpdateDto(string Description, PurposeEnum Purpose, int UserId);


