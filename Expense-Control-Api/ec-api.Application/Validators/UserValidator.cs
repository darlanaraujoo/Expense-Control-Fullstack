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

        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("E-mail é obrigatório.")
            .EmailAddress()
            .WithMessage("E-mail inválido.");

        RuleFor(x => x.Password)
            .NotEmpty()
            .WithMessage("Senha é obrigatória.")
            .MinimumLength(6)
            .WithMessage("Senha deve ter pelo menos 6 caracteres.");
    }  
}