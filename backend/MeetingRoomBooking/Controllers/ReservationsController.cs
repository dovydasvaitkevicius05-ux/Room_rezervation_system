using MeetingRoomBooking.Configuration;
using MeetingRoomBooking.Data;
using MeetingRoomBooking.DTOs;
using MeetingRoomBooking.DTOs.Reservations;
using MeetingRoomBooking.Models;
using MeetingRoomBooking.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace MeetingRoomBooking.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservationsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly BookingSettings _bookingSettings;

        public ReservationsController(
            AppDbContext context,
            IOptions<BookingSettings> options)
        {
            _context = context;
            _bookingSettings = options.Value;
        }

        /// <summary>
        /// Get all reservations.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReservationDto>>> GetReservations(
            [FromQuery] ReservationFilterDto filter)
        {
            // Date range validation
            if (filter.From.HasValue &&
                filter.To.HasValue &&
                filter.From.Value > filter.To.Value)
            {
                return CreateError(
                    400,
                    "INVALID_DATE_RANGE",
                    "'From' date must be earlier than or equal to 'To' date.");
            }

            var query = _context.Reservations.AsQueryable();

            // Filter by room
            if (filter.RoomId.HasValue)
            {
                query = query.Where(r => r.RoomId == filter.RoomId.Value);
            }

            // Filter by organizer
            if (filter.OrganizerId.HasValue)
            {
                query = query.Where(r => r.OrganizerId == filter.OrganizerId.Value);
            }

            // Filter by status
            if (filter.Status.HasValue)
            {
                query = query.Where(r => r.Status == filter.Status.Value);
            }

            // Filter by date range (reservations that overlap the given period)
            if (filter.From.HasValue)
            {
                query = query.Where(r => r.PlannedEnd >= filter.From.Value);
            }

            if (filter.To.HasValue)
            {
                query = query.Where(r => r.PlannedStart <= filter.To.Value);
            }

            var reservations = await query
                .OrderBy(r => r.PlannedStart)
                .Select(r => new ReservationDto
                {
                    Id = r.Id,
                    OrganizerId = r.OrganizerId,
                    RoomId = r.RoomId,
                    Title = r.Title,
                    PlannedStart = r.PlannedStart,
                    PlannedEnd = r.PlannedEnd,
                    ParticipantCount = r.ParticipantCount,
                    Status = r.Status
                })
                .ToListAsync();

            return reservations;
        }

        /// <summary>
        /// Get reservation by ID.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<Reservation>> GetReservation(int id)
        {
            var reservation = await _context.Reservations
                .FirstOrDefaultAsync(r => r.Id == id);

            if (reservation == null)
            {
                return NotFound();
            }

            return reservation;
        }

        /// <summary>
        /// Create a new reservation.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<Reservation>> CreateReservation(CreateReservationDto dto)
        {
            var reservation = new Reservation
            {
                RoomId = dto.RoomId,
                OrganizerId = dto.OrganizerId,
                Title = dto.Title,
                PlannedStart = dto.PlannedStart,
                PlannedEnd = dto.PlannedEnd,
                ParticipantCount = dto.ParticipantCount,
                Status = dto.Status
            };
            var validationResult = await ValidateReservation(reservation);

            if (validationResult != null)
            {
                return validationResult;
            }

            _context.Reservations.Add(reservation);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetReservation),
                new { id = reservation.Id },
                reservation);
        }

        /// <summary>
        /// Update existing reservation.
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReservation(
            int id,
            Reservation reservation)
        {
            if (id != reservation.Id)
            {
                return BadRequest(
                    "Route ID does not match reservation ID.");
            }

            var existingReservation =
                await _context.Reservations.FindAsync(id);

            if (existingReservation == null)
            {
                return NotFound();
            }

            var validationResult =
                await ValidateReservation(reservation);

            if (validationResult != null)
            {
                return validationResult;
            }

            _context.Entry(existingReservation)
                .CurrentValues
                .SetValues(reservation);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Delete reservation.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            var reservation =
                await _context.Reservations.FindAsync(id);

            if (reservation == null)
            {
                return NotFound();
            }

            _context.Reservations.Remove(reservation);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Validates reservation booking rules.
        /// </summary>
        private async Task<ActionResult?> ValidateReservation(
            Reservation reservation)
        {
            // Start must be in the future
            if (reservation.PlannedStart <= DateTime.Now)
            {
                return CreateError(
                    400,
                    "INVALID_START_TIME",
                    "Reservation start time must be in the future.");
            }

            // End must be after start
            if (reservation.PlannedEnd <= reservation.PlannedStart)
            {
                return CreateError(
                    400,
                    "INVALID_START_TIME",
                    "Reservation end time must be after start time.");
            }

            // Maximum duration
            var duration =
                reservation.PlannedEnd - reservation.PlannedStart;

            if (duration.TotalDays >
                _bookingSettings.MaxReservationDurationDays)
            {
                return CreateError(
                    400,
                    "MAX_DURATION_EXCEEDED",
                    $"Reservation duration cannot exceed {_bookingSettings.MaxReservationDurationDays} days.");
            }

            // Booking horizon
            if (reservation.PlannedStart >
                DateTime.Now.AddDays(
                    _bookingSettings.MaxBookingHorizonDays))
            {
                return CreateError(
                    400,
                    "BOOKING_HORIZON_EXCEEDED",
                    $"Reservation cannot start more than {_bookingSettings.MaxBookingHorizonDays} days in advance.");
            }

            // Room existence
            var room =
                await _context.Rooms.FindAsync(reservation.RoomId);

            if (room == null)
            {
                return CreateError(
                    404,
                    "ROOM_NOT_FOUND",
                    "Selected room does not exist.");
            }

            // Organizer existence
            var organizer =
                await _context.Users.FindAsync(
                    reservation.OrganizerId);

            if (organizer == null)
            {
                return CreateError(
                    404,
                    "USER_NOT_FOUND",
                    "Selected organizer does not exist.");
            }

            // Active rooms only
            if (room.Status == RoomStatus.Inactive)
            {
                return CreateError(
                    400,
                    "ROOM_INACTIVE",
                    "Inactive room cannot be booked.");
            }

            // Capacity
            if (reservation.ParticipantCount >
                room.MaxCapacity)
            {
                return CreateError(
                    400,
                    "ROOM_CAPACITY_EXCEEDED",
                    $"Room capacity is {room.MaxCapacity} participants.");
            }

            // No overlapping room bookings
            bool roomOccupied =
                await _context.Reservations.AnyAsync(r =>
                    r.Id != reservation.Id &&
                    r.RoomId == reservation.RoomId &&
                    r.Status != ReservationStatus.Cancelled &&
                    reservation.PlannedStart < r.PlannedEnd &&
                    reservation.PlannedEnd > r.PlannedStart);

            if (roomOccupied)
            {
                return CreateError(
                    409,
                    "ROOM_BOOKING_CONFLICT",
                    "Room is already booked during the selected time.");
            }

            // No overlapping organizer bookings
            bool organizerBusy =
                await _context.Reservations.AnyAsync(r =>
                    r.Id != reservation.Id &&
                    r.OrganizerId == reservation.OrganizerId &&
                    r.Status != ReservationStatus.Cancelled &&
                    reservation.PlannedStart < r.PlannedEnd &&
                    reservation.PlannedEnd > r.PlannedStart);

            if (organizerBusy)
            {
                return CreateError(
                    409,
                    "ORGANIZER_BOOKING_CONFLICT",
                    "Organizer already has another meeting at the selected time.");
            }

            return null;
        }
        /// <summary>
        /// Error message if validation is wrong
        /// </summary>
        /// <param name="status">Status of error</param>
        /// <param name="errorCode">Code of the error</param>
        /// <param name="message">Error message for human</param>
        /// <returns></returns>
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