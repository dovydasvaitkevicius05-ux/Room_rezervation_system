using MeetingRoomBooking.Data;
using MeetingRoomBooking.DTOs;
using MeetingRoomBooking.DTOs.Rooms;
using MeetingRoomBooking.Models;
using MeetingRoomBooking.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MeetingRoomBooking.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomsController : ControllerBase
    {
        private readonly AppDbContext _context;

        /// <summary>
        /// Database context.
        /// </summary>
        /// <param name="context">Application database context.</param>
        public RoomsController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get all rooms.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomDto>>> GetRooms([FromQuery] RoomFilterDto filter)
        {
            var query = _context.Rooms.AsQueryable();

            // Filter by minimum capacity
            if (filter.MinCapacity.HasValue)
            {
                query = query.Where(room =>
                    room.MaxCapacity >= filter.MinCapacity.Value);
            }

            // Filter by floor
            if (filter.Floor.HasValue)
            {
                query = query.Where(room =>
                    room.Floor == filter.Floor.Value);
            }

            // Filter by equipment
            if (filter.Equipment.HasValue)
            {
                query = query.Where(room =>
                    room.Equipment.Contains(filter.Equipment.Value));
            }

            var rooms = await query
           .Select(room => new RoomDto
           {
               Id = room.Id,
               Name = room.Name,
               Capacity = room.MaxCapacity,
               Floor = room.Floor,
               Location = room.Location,
               Equipment = room.Equipment,
               Status = room.Status
           })
           .ToListAsync();

            return rooms;
        }

        /// <summary>
        /// Get room by ID.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<RoomDto>> GetRoom(int id)
        {
            var room = await _context.Rooms
            .Where(r => r.Id == id)
            .Select(r => new RoomDto
            {
                Id = r.Id,
                Name = r.Name,
                Capacity = r.MaxCapacity,
                Floor = r.Floor,
                Location = r.Location,
                Equipment = r.Equipment,
                Status = r.Status
            })
            .FirstOrDefaultAsync();

                if (room == null)
                {
                    return CreateError(
                        404,
                        "ROOM_NOT_FOUND",
                        "Room was not found.");
                }

                return room;
        }

        /// <summary>
        /// Create a new room.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult> CreateRoom(
            CreateRoomDto dto)
        {
            var room = new Room
            {
                Name = dto.Name,
                MaxCapacity = dto.MaxCapacity,
                Floor = dto.Floor,
                Location = dto.Location,
                Equipment = dto.Equipment,
                Status = dto.Status
            };

            _context.Rooms.Add(room);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetRoom),
                new { id = room.Id },
                room);
        }

        /// <summary>
        /// Update existing room.
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoom(
    int id,
    UpdateRoomDto dto)
        {
            var room = await _context.Rooms.FindAsync(id);

            if (room == null)
            {
                return CreateError(
                    404,
                    "ROOM_NOT_FOUND",
                    "Room was not found.");
            }

            room.Name = dto.Name;
            room.MaxCapacity = dto.MaxCapacity;
            room.Floor = dto.Floor;
            room.Location = dto.Location;
            room.Equipment = dto.Equipment;
            room.Status = dto.Status;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Delete room.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var room = await _context.Rooms.FindAsync(id);

            if (room == null)
            {
                return CreateError(
                    404,
                    "ROOM_NOT_FOUND",
                    "Room was not found.");
            }

            //Cheking if room has active reservations
            bool hasReservations =
                await _context.Reservations.AnyAsync(r =>
                    r.RoomId == id &&
                    r.Status != ReservationStatus.Cancelled);

            if (hasReservations)
            {
                return CreateError(
                    409,
                    "ROOM_HAS_RESERVATIONS",
                    "Room cannot be deleted because it has reservations.");
            }

            _context.Rooms.Remove(room);

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