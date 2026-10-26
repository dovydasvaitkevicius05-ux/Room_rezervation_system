using MeetingRoomBooking.Controllers;
using MeetingRoomBooking.DTOs.Rooms;
using Xunit;

namespace MeetingRoomBooking.Tests
{
    /// <summary>
    /// Tests for room listing and filtering (by minimum capacity and by floor).
    /// </summary>
    public class RoomServiceTests
    {
        // 13
        /// <summary>
        /// Filtering by minimum capacity returns only rooms whose capacity
        /// is greater than or equal to the requested value.
        /// </summary>
        [Fact]
        public async Task GetFilteredRooms_ShouldReturnOnlyRoomsMatchingCapacity()
        {
            // Arrange: rooms with capacities 4, 10 and 20
            using var context = TestHelper.CreateContext();
            TestHelper.AddRoom(context, "Small", maxCapacity: 4);
            TestHelper.AddRoom(context, "Medium", maxCapacity: 10);
            TestHelper.AddRoom(context, "Large", maxCapacity: 20);
            var controller = new RoomsController(context);

            // Act: request rooms that fit at least 10 people
            var result = await controller.GetRooms(new RoomFilterDto { MinCapacity = 10 });

            // Assert: only "Medium" and "Large" are returned; "Small" is excluded
            var rooms = Assert.IsAssignableFrom<IEnumerable<RoomDto>>(result.Value).ToList();
            Assert.Equal(2, rooms.Count);
            Assert.All(rooms, r => Assert.True(r.Capacity >= 10));
            Assert.DoesNotContain(rooms, r => r.Name == "Small");
        }

        // 14
        /// <summary>
        /// Filtering by floor returns only rooms located on the specified floor.
        /// </summary>
        [Fact]
        public async Task GetFilteredRooms_ShouldReturnOnlyRoomsOnSpecifiedFloor()
        {
            // Arrange: one room on floor 1, two on floor 2 and one on floor 3
            using var context = TestHelper.CreateContext();
            TestHelper.AddRoom(context, "Floor1-A", floor: 1);
            TestHelper.AddRoom(context, "Floor2-A", floor: 2);
            TestHelper.AddRoom(context, "Floor2-B", floor: 2);
            TestHelper.AddRoom(context, "Floor3-A", floor: 3);
            var controller = new RoomsController(context);

            // Act: request rooms on floor 2
            var result = await controller.GetRooms(new RoomFilterDto { Floor = 2 });

            // Assert: exactly the two floor-2 rooms are returned
            var rooms = Assert.IsAssignableFrom<IEnumerable<RoomDto>>(result.Value).ToList();
            Assert.Equal(2, rooms.Count);
            Assert.All(rooms, r => Assert.Equal(2, r.Floor));
        }
    }
}