using System.ComponentModel.DataAnnotations;

namespace MeetingRoomBooking.DTOs.Users
{
    public class CreateUserDto
    {
        [Required(ErrorMessage = "Name is required.")]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Surname is required.")]
        [StringLength(100)]
        public string Surname { get; set; } = string.Empty;
    }
}
