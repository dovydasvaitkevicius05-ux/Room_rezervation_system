namespace MeetingRoomBooking.Configuration
{
    /// <summary>
    /// Reservation system settings.
    /// </summary>
    public class BookingSettings
    {
        /// <summary>
        /// Maximum reservation duration in days.
        /// </summary>
        public int MaxReservationDurationDays { get; set; }

        /// <summary>
        /// Maximum booking horizon in days.
        /// </summary>
        public int MaxBookingHorizonDays { get; set; }
    }
}