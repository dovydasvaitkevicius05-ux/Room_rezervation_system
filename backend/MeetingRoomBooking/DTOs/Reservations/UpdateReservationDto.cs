namespace MeetingRoomBooking.DTOs.Reservations
{
    public class UpdateReservationDto
    {
        public int RoomId { get; set; }
        public int OrganizerId { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime PlannedStart { get; set; }
        public DateTime PlannedEnd { get; set; }
        public int ParticipantCount { get; set; }
    }
}