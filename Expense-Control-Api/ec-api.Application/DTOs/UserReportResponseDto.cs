namespace ec_api.Application.DTOs;

public record UserReportItemDto(
    string Name,
    decimal TotalRecipes,
    decimal TotalExpenses,
    decimal Balance
);

public record UserReportResponseDto(
    List<UserReportItemDto> People,
    decimal GeneralTotalRecipes,
    decimal GeneralTotalExpenses,
    decimal GeneralNetBalance
);