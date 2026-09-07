using LocalCart.Api.DTOs.Auth;
using LocalCart.Api.Entities;
using LocalCart.Api.Exceptions;
using LocalCart.Api.Interfaces.Repositories;
using LocalCart.Api.Interfaces.Services;

namespace LocalCart.Api.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasherService _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;

    public AuthService(
        IUserRepository userRepository,
        IPasswordHasherService passwordHasher,
        IJwtTokenService jwtTokenService)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto)
    {
        var email = dto.Email.Trim();
        var emailExists = await _userRepository.ExistsByEmailAsync(email);
        if (emailExists)
        {
            throw new ConflictException($"A user with email '{email}' already exists.");
        }

        var requestedRole = string.IsNullOrWhiteSpace(dto.Role) ? "Customer" : dto.Role.Trim();
        var isVendor = requestedRole.Equals("Vendor", StringComparison.OrdinalIgnoreCase) || !string.IsNullOrWhiteSpace(dto.ShopName);
        var roleName = isVendor ? "Vendor" : requestedRole;

        var role = await _userRepository.GetRoleByNameAsync(roleName)
            ?? throw new BadRequestException($"Role '{roleName}' does not exist.");

        var passwordHash = _passwordHasher.HashPassword(dto.Password);

        var user = new AppUser
        {
            FullName = dto.FullName.Trim(),
            Email = email,
            NormalizedEmail = email.ToUpperInvariant(),
            PhoneNumber = dto.PhoneNumber?.Trim(),
            PasswordHash = passwordHash,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        user.AppUserRoles.Add(new AppUserRole
        {
            RoleId = role.RoleId,
            AssignedAt = DateTime.UtcNow
        });

        if (isVendor)
        {
            var vendor = new Vendor
            {
                ShopName = string.IsNullOrWhiteSpace(dto.ShopName) ? $"{user.FullName}'s Shop" : dto.ShopName.Trim(),
                OwnerName = user.FullName,
                PhoneNumber = string.IsNullOrWhiteSpace(dto.PhoneNumber) ? "Not Provided" : dto.PhoneNumber.Trim(),
                Email = email,
                Address = string.IsNullOrWhiteSpace(dto.Address) ? "Local Market" : dto.Address.Trim(),
                City = string.IsNullOrWhiteSpace(dto.City) ? "Mumbai" : dto.City.Trim(),
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            user.Vendors.Add(vendor);
        }

        await _userRepository.AddAsync(user);

        var roles = new List<string> { role.RoleName };
        var refreshToken = _jwtTokenService.GenerateRefreshToken();
        var sessionId = Guid.NewGuid();

        return _jwtTokenService.GenerateAuthResponse(user, roles, refreshToken, sessionId);
    }

    public async Task<AuthResponseDto> RegisterVendorAsync(RegisterVendorRequestDto dto)
    {
        var email = dto.Email.Trim();
        var emailExists = await _userRepository.ExistsByEmailAsync(email);
        if (emailExists)
        {
            throw new ConflictException($"A user with email '{email}' already exists.");
        }

        var role = await _userRepository.GetRoleByNameAsync("Vendor")
            ?? throw new BadRequestException("Vendor role is not configured in the system.");

        var passwordHash = _passwordHasher.HashPassword(dto.Password);

        var user = new AppUser
        {
            FullName = dto.OwnerName.Trim(),
            Email = email,
            NormalizedEmail = email.ToUpperInvariant(),
            PhoneNumber = dto.PhoneNumber.Trim(),
            PasswordHash = passwordHash,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        user.AppUserRoles.Add(new AppUserRole
        {
            RoleId = role.RoleId,
            AssignedAt = DateTime.UtcNow
        });

        var vendor = new Vendor
        {
            ShopName = dto.StoreName.Trim(),
            OwnerName = dto.OwnerName.Trim(),
            PhoneNumber = dto.PhoneNumber.Trim(),
            Email = email,
            Address = string.IsNullOrWhiteSpace(dto.Address) ? "Local Market" : dto.Address.Trim(),
            City = string.IsNullOrWhiteSpace(dto.City) ? "Mumbai" : dto.City.Trim(),
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        user.Vendors.Add(vendor);

        await _userRepository.AddAsync(user);

        var roles = new List<string> { role.RoleName };
        var refreshToken = _jwtTokenService.GenerateRefreshToken();
        var sessionId = Guid.NewGuid();

        return _jwtTokenService.GenerateAuthResponse(user, roles, refreshToken, sessionId);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto dto)
    {
        var user = await _userRepository.GetByEmailAsync(dto.Email);
        if (user is null || !_passwordHasher.VerifyPassword(dto.Password, user.PasswordHash))
        {
            throw new UnauthorizedException("Invalid email or password.");
        }

        if (!user.IsActive)
        {
            throw new UnauthorizedException("Your account is currently inactive. Please contact support.");
        }

        var roles = user.AppUserRoles.Select(ur => ur.Role.RoleName).ToList();
        var refreshToken = _jwtTokenService.GenerateRefreshToken();
        var sessionId = Guid.NewGuid();

        return _jwtTokenService.GenerateAuthResponse(user, roles, refreshToken, sessionId);
    }

    public async Task<AuthUserResponseDto> GetCurrentUserAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId)
            ?? throw new NotFoundException($"User with ID {userId} was not found.");

        var roles = user.AppUserRoles.Select(ur => ur.Role.RoleName).ToList();
        var vendor = user.Vendors.FirstOrDefault(v => v.DeletedAt == null);

        return new AuthUserResponseDto
        {
            AppUserId = user.AppUserId,
            FullName = user.FullName,
            Email = user.Email ?? string.Empty,
            PhoneNumber = user.PhoneNumber,
            Roles = roles,
            VendorId = vendor?.VendorId,
            ShopName = vendor?.ShopName
        };
    }
}

