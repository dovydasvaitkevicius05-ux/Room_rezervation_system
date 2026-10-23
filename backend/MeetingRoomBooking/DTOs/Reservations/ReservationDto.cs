using MeetingRoomBooking.Models.Enums;

namespace MeetingRoomBooking.DTOs.Reservations
{
    public class ReservationDto
    {
        public int Id { get; set; }

        public int OrganizerId { get; set; }

        public int RoomId { get; set; }

        public string Title { get; set; } = string.Empty;

        public DateTime PlannedStart { get; set; }

        public DateTime PlannedEnd { get; set; }

        public int ParticipantCount { get; set; }

        public ReservationStatus Status { get; set; }
    }
}
