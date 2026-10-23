namespace MeetingRoomBooking.DTOs
{
    public class ErrorResponseDto
    {
        public int Status { get; set; }

        public string ErrorCode { get; set; } = string.Empty;

        public string Message { get; set; } = string.Empty;
    }
}
