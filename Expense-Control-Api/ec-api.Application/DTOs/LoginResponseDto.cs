namespace ec_api.Application.DTOs;

public record LoginResponseDto(string Token, LoginUserDto User);

public record LoginUserDto(int Id, string Name, string Email);
