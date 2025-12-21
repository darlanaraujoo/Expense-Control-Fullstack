using ec_api.Application.DTOs;
using FluentValidation;

namespace ec_api.Application.Validators;

public class UserValidator : AbstractValidator<UserCreateDto>
{
    public UserValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Nome é obrigatório");

        RuleFor(x => x.Age)
            .GreaterThan(0)
            .WithMessage("Idade deve ser um número positivo.")
            .NotEmpty()
            .WithMessage("Idade é obrigatória.");
    }  
}