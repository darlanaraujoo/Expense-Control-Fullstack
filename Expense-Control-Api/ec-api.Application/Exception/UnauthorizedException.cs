namespace ec_api.Application.Exception;

public class UnauthorizedException : System.Exception
{
    public UnauthorizedException(string message) : base(message)
    {
    }
}
