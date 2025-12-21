namespace ec_api.Application.DTOs;

public record UserResponseDto(int Id, string Name, int Age, DateTime CreateAt);

public record UserCreateDto(string Name, int Age);