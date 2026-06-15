using ec_api.DomainModel.Enums;

namespace ec_api.Application.DTOs;

public record TransactionResponseDto(
    int Id,
    string Description,
    decimal Value,
    string Type,
    string CategoryName,
    string UserName,
    DateTime TransactionDate,
    int UserId,
    int CategoryId
);

public record TransactionCreateDto(
    string Description,
    decimal Value,
    TypeEnum Type,
    int CategoryId,
    int UserId
);

public record TransactionUpdateDto(
    string Description,
    decimal Value,
    TypeEnum Type,
    int CategoryId,
    int UserId
);