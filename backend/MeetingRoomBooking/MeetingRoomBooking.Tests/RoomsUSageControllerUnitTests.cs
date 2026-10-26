using MeetingRoomBooking.Controllers;
using MeetingRoomBooking.DTOs.RoomUsage;
using MeetingRoomBooking.Models.Enums;
using Xunit;

namespace MeetingRoomBooking.Tests
{
    /// <summary>
    /// Tests for room usage statistics (most popular rooms).
    /// </summary>
    public class RoomsUsageControllerTests
    {
        // 15
        /// <summary>
        /// Rooms are returned in descending order by reservation count.
        /// Cancelled reservations are not counted in the reservation count,
        /// but are reported separately.
        /// </summary>
        [Fact]
        public async Task GetMostPopularRooms_ShouldReturnRoomsOrderedByReservationCount()
        {
            // Arrange: three rooms and one organizer
            using var context = TestHelper.CreateContext();
            var roomA = TestHelper.AddRoom(context, "Room A");
            var roomB = TestHelper.AddRoom(context, "Room B");
            var roomC = TestHelper.AddRoom(context, "Room C");
            var user = TestHelper.AddUser(context);

            // Room A: 1 active reservation
            TestHelper.AddReservation(context, roomA.Id, user.Id,
                TestHelper.Tomorrow(8), TestHelper.Tomorrow(9));

            // Room B: 3 counted reservations (2 Booked + 1 Completed)
            // plus 1 Cancelled reservation, which must not be counted
            TestHelper.AddReservation(context, roomB.Id, user.Id,
                TestHelper.Tomorrow(8), TestHelper.Tomorrow(9));
            TestHelper.AddReservation(context, roomB.Id, user.Id,
                TestHelper.Tomorrow(10), TestHelper.Tomorrow(11));
            TestHelper.AddReservation(context, roomB.Id, user.Id,
                TestHelper.Tomorrow(12), TestHelper.Tomorrow(13), ReservationStatus.Completed);
            TestHelper.AddReservation(context, roomB.Id, user.Id,
                TestHelper.Tomorrow(14), TestHelper.Tomorrow(15), ReservationStatus.Cancelled);

            // Room C: 2 active reservations
            TestHelper.AddReservation(context, roomC.Id, user.Id,
                TestHelper.Tomorrow(8), TestHelper.Tomorrow(9));
            TestHelper.AddReservation(context, roomC.Id, user.Id,
                TestHelper.Tomorrow(10), TestHelper.Tomorrow(11));

            var controller = new RoomsUsageController(context);

            // Act
            var result = await controller.GetMostPopularRooms();

            // Assert: all three rooms are returned
            var rooms = Assert.IsAssignableFrom<IEnumerable<RoomUsageDto>>(result.Value).ToList();
            Assert.Equal(3, rooms.Count);

            // Expected order: Room B (3) -> Room C (2) -> Room A (1)
            Assert.Equal(new[] { roomB.Id, roomC.Id, roomA.Id }, rooms.Select(r => r.RoomId).ToArray());
            Assert.Equal(new[] { 3, 2, 1 }, rooms.Select(r => r.ReservationCount).ToArray());

            // Cancelled reservations are excluded from ReservationCount and reported separately
            Assert.Equal(1, rooms[0].CancelledReservationCount);
        }
    }
}