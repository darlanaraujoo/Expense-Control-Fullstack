namespace ec_api.Application.Exception;

public class CustomValidationException : System.Exception
{
    public CustomValidationException(string exception) : base(exception)
    {
        
    }
}