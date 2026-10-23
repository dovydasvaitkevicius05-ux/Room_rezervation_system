namespace MeetingRoomBooking.Models.Enums
{
    public enum RoomStatus
    {
        /// <summary>
        /// Room is active, reservation can be made.
        /// </summary>
        Active = 0,

        /// <summary>
        /// Room is inactive, reservation cannot be made.
        /// </summary>
        Inactive = 1,

    }
}
