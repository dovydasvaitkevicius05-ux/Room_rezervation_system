using MeetingRoomBooking.Models.Enums;

namespace MeetingRoomBooking.DTOs.Rooms
{
    public class CreateRoomDto
    {
        public string Name { get; set; } = string.Empty;

        public int MaxCapacity { get; set; }

        public int Floor { get; set; }

        public string Location { get; set; } = string.Empty;

        public List<RoomEquipment> Equipment { get; set; } = new();

        public RoomStatus Status { get; set; }
    }
}
