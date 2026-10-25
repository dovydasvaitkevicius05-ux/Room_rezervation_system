using MeetingRoomBooking.Models.Enums;

namespace MeetingRoomBooking.DTOs.RoomUsage
{
    public class RoomUsageDto
    {
        public int RoomId { get; set; }

        public string RoomName { get; set; } = string.Empty;

        public int Capacity { get; set; }

        public int Floor { get; set; }

        public string Location { get; set; } = string.Empty;

        public List<RoomEquipment> Equipment { get; set; } = new();

        public RoomStatus Status { get; set; }

        public int ReservationCount { get; set; }

        public int CancelledReservationCount { get; set; }
    }
}
