namespace MeetingRoomBooking.Models.Enums;

public enum ReservationStatus
{
    /// <summary>
    /// Planned meeting.
    /// </summary>
    Booked = 0,

    /// <summary>
    /// Meeting finished.
    /// </summary>
    Completed = 1,

    /// <summary>
    /// Reservation canceled.
    /// </summary>
    Cancelled = 2
}