namespace MeetingRoomBooking.DTOs.Users
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;

        /// <summary>
        /// IDs of reservations organized by this user.
        /// </summary>
        public List<int> ReservationIds { get; set; } = new();
    }
}
