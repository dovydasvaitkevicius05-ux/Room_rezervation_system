using MeetingRoomBooking.Data;
using MeetingRoomBooking.DTOs;
using MeetingRoomBooking.DTOs.RoomUsage;
using MeetingRoomBooking.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MeetingRoomBooking.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomsUsageController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RoomsUsageController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Most popular rooms.
        /// Counts reservations except cancelled ones.
        /// </summary>
        [HttpGet("most-popular")]
        public async Task<ActionResult<IEnumerable<RoomUsageDto>>> GetMostPopularRooms()
        {
            var rooms = await _context.Rooms
                .Select(room => new RoomUsageDto
                {
                    RoomId = room.Id,
                    RoomName = room.Name,
                    Capacity = room.MaxCapacity,
                    Floor = room.Floor,
                    Location = room.Location,
                    Equipment = room.Equipment,
                    Status = room.Status,

                    ReservationCount =
                        _context.Reservations.Count(r =>
                            r.RoomId == room.Id &&
                            r.Status != ReservationStatus.Cancelled),

                    CancelledReservationCount =
                        _context.Reservations.Count(r =>
                            r.RoomId == room.Id &&
                            r.Status == ReservationStatus.Cancelled)
                })
                .OrderByDescending(r => r.ReservationCount)
                .ToListAsync();

            return rooms;
        }

        /// <summary>
        /// Least popular rooms.
        /// Shows active and cancelled reservation counts.
        /// </summary>
        [HttpGet("most-canceled")]
        public async Task<ActionResult<IEnumerable<RoomUsageDto>>> GetMostCanceledRooms()
        {
            var rooms = await _context.Rooms
                .Select(room => new RoomUsageDto
                {
                    RoomId = room.Id,
                    RoomName = room.Name,
                    Capacity = room.MaxCapacity,
                    Floor = room.Floor,
                    Location = room.Location,
                    Equipment = room.Equipment,
                    Status = room.Status,

                    ReservationCount =
                        _context.Reservations.Count(r =>
                            r.RoomId == room.Id &&
                            r.Status != ReservationStatus.Cancelled),

                    CancelledReservationCount =
                        _context.Reservations.Count(r =>
                            r.RoomId == room.Id &&
                            r.Status == ReservationStatus.Cancelled)
                })
                .OrderByDescending(r => r.CancelledReservationCount)
                .ThenByDescending(r => r.ReservationCount)
                .Take(5)
                .ToListAsync();

            return rooms;
        }
    }
}
