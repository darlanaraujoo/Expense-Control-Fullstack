using ec_api.DomainModel.Enums;

namespace ec_api.Application.DTOs;

public record TransactionResponseDto(
    int Id,
    string Description,
    decimal Value,
    string Type,
    string CategoryName,
    string UserName,
    DateTime TransactionDate
);
public record TransactionCreateDto
(
    string Description, 
    decimal Value, 
    TypeEnum Type, 
    int CategoryId, 
    int UserId
);