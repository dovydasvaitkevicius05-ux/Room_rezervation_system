using MeetingRoomBooking.Models.Enums;

namespace MeetingRoomBooking.DTOs.Rooms
{
    public class RoomFilterDto
    {
        public int? MinCapacity { get; set; }

        public int? Floor { get; set; }

        public RoomEquipment? Equipment { get; set; }
    }
}
