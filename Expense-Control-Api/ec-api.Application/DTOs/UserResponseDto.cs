namespace ec_api.Application.DTOs;

public record UserResponseDto(int Id, string Name, string Email, int Age, DateTime CreateAt);

public record UserCreateDto(string Name, int Age, string Email, string Password);

public record UserUpdateDto(string Name, int Age, string Email, string? Password);
