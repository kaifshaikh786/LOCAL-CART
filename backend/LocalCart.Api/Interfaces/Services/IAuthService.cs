using LocalCart.Api.DTOs.Auth;

namespace LocalCart.Api.Interfaces.Services;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto);

    Task<AuthResponseDto> RegisterVendorAsync(RegisterVendorRequestDto dto);

    Task<AuthResponseDto> LoginAsync(LoginRequestDto dto);

    Task<AuthUserResponseDto> GetCurrentUserAsync(int userId);
}

