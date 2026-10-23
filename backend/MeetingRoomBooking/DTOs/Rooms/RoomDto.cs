using MeetingRoomBooking.Models.Enums;

namespace MeetingRoomBooking.DTOs.Rooms
{
    public class RoomDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public int Capacity { get; set; }

        public int Floor { get; set; }

        public string Location { get; set; } = string.Empty;

        public List<RoomEquipment> Equipment { get; set; } = new();

        public RoomStatus Status { get; set; }
    }
}
