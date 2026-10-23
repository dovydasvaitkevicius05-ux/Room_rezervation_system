using MeetingRoomBooking.Models.Enums;

namespace MeetingRoomBooking.DTOs.Reservations
{
    public class ReservationFilterDto
    {
        public int? RoomId { get; set; }

        public int? OrganizerId { get; set; }

        public ReservationStatus? Status { get; set; }

        /// <summary>
        /// Start of the date range (inclusive).
        /// </summary>
        public DateTime? From { get; set; }

        /// <summary>
        /// End of the date range (inclusive).
        /// </summary>
        public DateTime? To { get; set; }
    }
}