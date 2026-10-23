using System.ComponentModel.DataAnnotations;
using MeetingRoomBooking.Models.Enums;

namespace MeetingRoomBooking.Models
{
    public class Room
    {
        /// <summary>
        /// Unique room ID.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Room name.
        /// </summary>
        [Required(ErrorMessage = "Pavadinimas privalomas.")]
        [StringLength(100, ErrorMessage = "Pavadinimas negali būti ilgesnis nei 100 simbolių.")]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Max capacity of people in room.
        /// </summary>
        [Range(1, 1000, ErrorMessage = "Talpa turi būti nuo 1 iki 1000.")]
        public int MaxCapacity { get; set; }

        /// <summary>
        /// Floor of the room.
        /// </summary>
        public int Floor { get; set; }

        /// <summary>
        /// Place in the building.
        /// </summary>
        [StringLength(200)]
        public string Location { get; set; } = string.Empty;

        /// <summary>
        /// Equipment of the room.
        /// </summary>
        public List<RoomEquipment> Equipment { get; set; } = new();


        /// <summary>
        /// Is room active at the time and can reservation be made.
        /// </summary>
        public RoomStatus Status { get; set; } = RoomStatus.Active;
    }
}
