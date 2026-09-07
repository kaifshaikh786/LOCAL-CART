using LocalCart.Api.DTOs.Auth;
using LocalCart.Api.Entities;

namespace LocalCart.Api.Interfaces.Services;

public interface IJwtTokenService
{
    AuthResponseDto GenerateAuthResponse(AppUser user, List<string> roles, string refreshToken, Guid userSessionId);

    string GenerateRefreshToken();
    string HashRefreshToken(string refreshToken);
}