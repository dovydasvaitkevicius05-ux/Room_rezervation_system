using MeetingRoomBooking.Data;
using MeetingRoomBooking.DTOs;
using MeetingRoomBooking.DTOs.Users;
using MeetingRoomBooking.Models;
using MeetingRoomBooking.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MeetingRoomBooking.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        /// <summary>
        /// Database context.
        /// </summary>
        /// <param name="context">Application database context.</param>
        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get all users.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _context.Users
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Name = u.Name,
                    Surname = u.Surname,
                    ReservationIds = u.OrganizedReservations
                        .Select(r => r.Id)
                        .ToList()
                })
                .ToListAsync();

            return users;
        }

        /// <summary>
        /// Get user by ID.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var user = await _context.Users
                .Where(u => u.Id == id)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Name = u.Name,
                    Surname = u.Surname,
                    ReservationIds = u.OrganizedReservations
                        .Select(r => r.Id)
                        .ToList()
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return CreateError(
                    404,
                    "USER_NOT_FOUND",
                    "User was not found.");
            }

            return user;
        }

        /// <summary>
        /// Create a new user.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<UserDto>> CreateUser(CreateUserDto dto)
        {
            var user = new User
            {
                Name = dto.Name,
                Surname = dto.Surname
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var result = new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Surname = user.Surname
            };

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, result);
        }

        /// <summary>
        /// Update existing user.
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UpdateUserDto dto)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return CreateError(
                    404,
                    "USER_NOT_FOUND",
                    "User was not found.");
            }

            user.Name = dto.Name;
            user.Surname = dto.Surname;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Delete user.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return CreateError(
                    404,
                    "USER_NOT_FOUND",
                    "User was not found.");
            }

            // Checking if user has active reservations
            bool hasReservations = await _context.Reservations.AnyAsync(r =>
                r.OrganizerId == id &&
                r.Status != ReservationStatus.Cancelled);

            if (hasReservations)
            {
                return CreateError(
                    409,
                    "USER_HAS_RESERVATIONS",
                    "User cannot be deleted because they have reservations.");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Error message if validation is wrong
        /// </summary>
        /// <param name="status">Status of error</param>
        /// <param name="errorCode">Code of the error</param>
        /// <param name="message">Error message for human</param>
        /// <returns>StatusCode</returns>
        private ActionResult CreateError(
            int status,
            string errorCode,
            string message)
        {
            return StatusCode(status, new ErrorResponseDto
            {
                Status = status,
                ErrorCode = errorCode,
                Message = message
            });
        }
    }
}