using System.ComponentModel.DataAnnotations;

namespace MeetingRoomBooking.Models
{
    public class User
    {
        /// <summary>
        /// Unique user ID.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Name of the user.
        /// </summary>
        [Required(ErrorMessage = "Name is required.")]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;


        /// <summary>
        /// Surname of the user.
        /// </summary>
        [Required(ErrorMessage = "Surname is required.")]
        [StringLength(100)]
        public string Surname { get; set; } = string.Empty;

        /// <summary>
        /// Rezervations that are made by this user.
        /// </summary>
        public ICollection<Reservation> OrganizedReservations { get; set; } = new List<Reservation>();

    }
}
