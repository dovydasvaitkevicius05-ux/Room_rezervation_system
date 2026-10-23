using System.ComponentModel.DataAnnotations;
using MeetingRoomBooking.Models.Enums;

namespace MeetingRoomBooking.Models
{
    public class Reservation
    {
        /// <summary>
        /// Unique ID of reservation.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// ID of the room that reservation has.
        /// </summary>
        public int RoomId { get; set; }

        /// <summary>
        /// ID of person that made reservation.
        /// </summary>
        public int OrganizerId { get; set; }

        /// <summary>
        /// Title of the reservation.
        /// </summary>
        [Required(ErrorMessage = "Meeting title is required.")]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// Planned start of reservation.
        /// </summary>
        public DateTime PlannedStart { get; set; }

        /// <summary>
        /// Planned end of reservation.
        /// </summary>
        public DateTime PlannedEnd { get; set; }

        /// <summary>
        /// Number of participants in reservation.
        /// </summary>
        [Range(1, 1000, ErrorMessage = "Number of participants must be at least 1.")]
        public int ParticipantCount { get; set; }

        /// <summary>
        /// Status of reservation.
        /// </summary>
        public ReservationStatus Status { get; set; } = ReservationStatus.Booked;
    }
}
