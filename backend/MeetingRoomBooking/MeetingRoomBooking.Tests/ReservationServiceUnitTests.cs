using MeetingRoomBooking.Configuration;
using MeetingRoomBooking.Controllers;
using MeetingRoomBooking.Data;
using MeetingRoomBooking.DTOs;
using MeetingRoomBooking.DTOs.Reservations;
using MeetingRoomBooking.Models;
using MeetingRoomBooking.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Xunit;

namespace MeetingRoomBooking.Tests
{
    /// <summary>
    /// Shared helper methods for tests (in-memory database and test data factories).
    /// Used by all test classes in this project.
    /// </summary>
    internal static class TestHelper
    {
        /// <summary>
        /// Creates a new <see cref="AppDbContext"/> backed by an isolated in-memory database.
        /// Each call uses a unique database name, so tests never share state.
        /// </summary>
        public static AppDbContext CreateContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            return new AppDbContext(options);
        }

        /// <summary>
        /// Adds a room to the database and returns it (with the generated Id).
        /// </summary>
        public static Room AddRoom(
            AppDbContext context,
            string name = "Room A",
            int maxCapacity = 10,
            int floor = 1,
            RoomStatus status = RoomStatus.Active)
        {
            var room = new Room
            {
                Name = name,
                MaxCapacity = maxCapacity,
                Floor = floor,
                Location = "Test location",
                Status = status
            };

            context.Rooms.Add(room);
            context.SaveChanges();
            return room;
        }

        /// <summary>
        /// Adds a user to the database and returns it (with the generated Id).
        /// </summary>
        public static User AddUser(AppDbContext context, string name = "Jonas", string surname = "Jonaitis")
        {
            var user = new User { Name = name, Surname = surname };

            context.Users.Add(user);
            context.SaveChanges();
            return user;
        }

        /// <summary>
        /// Adds a reservation directly to the database, bypassing controller validation.
        /// Useful for arranging test scenarios (e.g. past or in-progress reservations).
        /// </summary>
        public static Reservation AddReservation(
            AppDbContext context,
            int roomId,
            int organizerId,
            DateTime start,
            DateTime end,
            ReservationStatus status = ReservationStatus.Booked,
            int participants = 5)
        {
            var reservation = new Reservation
            {
                RoomId = roomId,
                OrganizerId = organizerId,
                Title = "Test meeting",
                PlannedStart = start,
                PlannedEnd = end,
                ParticipantCount = participants,
                Status = status
            };

            context.Reservations.Add(reservation);
            context.SaveChanges();
            return reservation;
        }

        /// <summary>
        /// Returns tomorrow's date at the given time.
        /// Always in the future and within the booking horizon, so the result is
        /// stable regardless of when the tests are executed.
        /// </summary>
        public static DateTime Tomorrow(int hour, int minute = 0)
            => DateTime.Today.AddDays(1).AddHours(hour).AddMinutes(minute);
    }

    /// <summary>
    /// Tests for reservation management: creation, validation rules,
    /// cancellation and ending a reservation early.
    /// </summary>
    public class ReservationServiceTests
    {
        /// <summary>
        /// Creates the controller under test with fixed booking settings
        /// (max duration: 7 days, booking horizon: 30 days).
        /// </summary>
        private static ReservationsController CreateController(AppDbContext context)
        {
            var settings = Options.Create(new BookingSettings
            {
                MaxReservationDurationDays = 7,
                MaxBookingHorizonDays = 30
            });

            return new ReservationsController(context, settings);
        }

        /// <summary>
        /// Builds a create-reservation request with sensible defaults.
        /// </summary>
        private static CreateReservationDto CreateDto(
            int roomId,
            int organizerId,
            DateTime start,
            DateTime end,
            int participants = 5)
        {
            return new CreateReservationDto
            {
                RoomId = roomId,
                OrganizerId = organizerId,
                Title = "Test meeting",
                PlannedStart = start,
                PlannedEnd = end,
                ParticipantCount = participants
            };
        }

        /// <summary>
        /// Asserts that the controller returned an error with the expected
        /// HTTP status code and application error code.
        /// </summary>
        private static void AssertError(ActionResult<Reservation> result, int expectedStatus, string expectedCode)
        {
            var objectResult = Assert.IsAssignableFrom<ObjectResult>(result.Result);
            Assert.Equal(expectedStatus, objectResult.StatusCode);

            var error = Assert.IsType<ErrorResponseDto>(objectResult.Value);
            Assert.Equal(expectedStatus, error.Status);
            Assert.Equal(expectedCode, error.ErrorCode);
        }

        // 1
        /// <summary>
        /// A reservation is created when the room is active, the organizer exists,
        /// the time range is valid and there are no conflicts.
        /// </summary>
        [Fact]
        public async Task CreateReservation_ShouldCreateReservation_WhenDataIsValid()
        {
            // Arrange: an active room, an existing organizer and a valid future time range
            using var context = TestHelper.CreateContext();
            var room = TestHelper.AddRoom(context);
            var user = TestHelper.AddUser(context);
            var controller = CreateController(context);
            var dto = CreateDto(room.Id, user.Id, TestHelper.Tomorrow(10), TestHelper.Tomorrow(11));

            // Act
            var result = await controller.CreateReservation(dto);

            // Assert: 201 Created is returned and the reservation is saved as Booked
            var created = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returned = Assert.IsType<Reservation>(created.Value);
            Assert.Equal(room.Id, returned.RoomId);
            Assert.Equal(user.Id, returned.OrganizerId);

            var saved = Assert.Single(context.Reservations);
            Assert.Equal(dto.PlannedStart, saved.PlannedStart);
            Assert.Equal(dto.PlannedEnd, saved.PlannedEnd);
            Assert.Equal(ReservationStatus.Booked, saved.Status);
        }

        // 2
        /// <summary>
        /// Creation fails with 404 ROOM_NOT_FOUND when the specified room does not exist.
        /// </summary>
        [Fact]
        public async Task CreateReservation_ShouldFail_WhenRoomDoesNotExist()
        {
            // Arrange: an existing organizer but a non-existent room id
            using var context = TestHelper.CreateContext();
            var user = TestHelper.AddUser(context);
            var controller = CreateController(context);
            var dto = CreateDto(roomId: 999, user.Id, TestHelper.Tomorrow(10), TestHelper.Tomorrow(11));

            // Act
            var result = await controller.CreateReservation(dto);

            // Assert: error is returned and nothing is saved
            AssertError(result, 404, "ROOM_NOT_FOUND");
            Assert.Empty(context.Reservations);
        }

        // 3
        /// <summary>
        /// Creation fails with 404 USER_NOT_FOUND when the specified organizer does not exist.
        /// </summary>
        [Fact]
        public async Task CreateReservation_ShouldFail_WhenOrganizerDoesNotExist()
        {
            // Arrange: an existing room but a non-existent organizer id
            using var context = TestHelper.CreateContext();
            var room = TestHelper.AddRoom(context);
            var controller = CreateController(context);
            var dto = CreateDto(room.Id, organizerId: 999, TestHelper.Tomorrow(10), TestHelper.Tomorrow(11));

            // Act
            var result = await controller.CreateReservation(dto);

            // Assert: error is returned and nothing is saved
            AssertError(result, 404, "USER_NOT_FOUND");
            Assert.Empty(context.Reservations);
        }

        // 4
        /// <summary>
        /// Creation fails with 400 ROOM_INACTIVE when the room is inactive and cannot be booked.
        /// </summary>
        [Fact]
        public async Task CreateReservation_ShouldFail_WhenRoomIsInactive()
        {
            // Arrange: an inactive room
            using var context = TestHelper.CreateContext();
            var room = TestHelper.AddRoom(context, status: RoomStatus.Inactive);
            var user = TestHelper.AddUser(context);
            var controller = CreateController(context);
            var dto = CreateDto(room.Id, user.Id, TestHelper.Tomorrow(10), TestHelper.Tomorrow(11));

            // Act
            var result = await controller.CreateReservation(dto);

            // Assert: error is returned and nothing is saved
            AssertError(result, 400, "ROOM_INACTIVE");
            Assert.Empty(context.Reservations);
        }

        // 5
        /// <summary>
        /// Creation fails with 400 INVALID_START_TIME when the start time is in the past.
        /// </summary>
        [Fact]
        public async Task CreateReservation_ShouldFail_WhenStartDateIsInPast()
        {
            // Arrange: a reservation that started two hours ago
            using var context = TestHelper.CreateContext();
            var room = TestHelper.AddRoom(context);
            var user = TestHelper.AddUser(context);
            var controller = CreateController(context);
            var start = DateTime.Now.AddHours(-2);
            var dto = CreateDto(room.Id, user.Id, start, start.AddHours(1));

            // Act
            var result = await controller.CreateReservation(dto);

            // Assert: error is returned and nothing is saved
            AssertError(result, 400, "INVALID_START_TIME");
            Assert.Empty(context.Reservations);
        }

        // 6
        /// <summary>
        /// Creation fails with 400 INVALID_END_TIME when the end time is earlier than the start time.
        /// </summary>
        [Fact]
        public async Task CreateReservation_ShouldFail_WhenEndBeforeStart()
        {
            // Arrange: the end time is one hour before the start time
            using var context = TestHelper.CreateContext();
            var room = TestHelper.AddRoom(context);
            var user = TestHelper.AddUser(context);
            var controller = CreateController(context);
            var start = TestHelper.Tomorrow(11);
            var dto = CreateDto(room.Id, user.Id, start, start.AddHours(-1));

            // Act
            var result = await controller.CreateReservation(dto);

            // Assert: error is returned and nothing is saved
            AssertError(result, 400, "INVALID_END_TIME");
            Assert.Empty(context.Reservations);
        }

        // 7
        /// <summary>
        /// Creation fails with 409 ROOM_BOOKING_CONFLICT when the time range overlaps
        /// with another booked reservation for the same room.
        /// </summary>
        [Fact]
        public async Task CreateReservation_ShouldFail_WhenRoomAlreadyBooked()
        {
            // Arrange: the room is already booked 10:00-11:00 by another user
            using var context = TestHelper.CreateContext();
            var room = TestHelper.AddRoom(context);
            var firstUser = TestHelper.AddUser(context, "Jonas", "Jonaitis");
            var secondUser = TestHelper.AddUser(context, "Petras", "Petraitis");
            TestHelper.AddReservation(context, room.Id, firstUser.Id,
                TestHelper.Tomorrow(10), TestHelper.Tomorrow(11));
            var controller = CreateController(context);

            // The new request (10:30-11:30) overlaps the existing one: same room, different organizer
            var dto = CreateDto(room.Id, secondUser.Id,
                TestHelper.Tomorrow(10, 30), TestHelper.Tomorrow(11, 30));

            // Act
            var result = await controller.CreateReservation(dto);

            // Assert: conflict is reported and only the original reservation remains
            AssertError(result, 409, "ROOM_BOOKING_CONFLICT");
            Assert.Single(context.Reservations);
        }

        // 8
        /// <summary>
        /// Creation fails with 409 ORGANIZER_BOOKING_CONFLICT when the organizer
        /// already has another meeting at an overlapping time.
        /// </summary>
        [Fact]
        public async Task CreateReservation_ShouldFail_WhenOrganizerHasAnotherMeeting()
        {
            // Arrange: the organizer already has a meeting 10:00-11:00 in Room A
            using var context = TestHelper.CreateContext();
            var firstRoom = TestHelper.AddRoom(context, "Room A");
            var secondRoom = TestHelper.AddRoom(context, "Room B");
            var user = TestHelper.AddUser(context);
            TestHelper.AddReservation(context, firstRoom.Id, user.Id,
                TestHelper.Tomorrow(10), TestHelper.Tomorrow(11));
            var controller = CreateController(context);

            // The new request (10:30-11:30) is for a different room, but the same organizer
            var dto = CreateDto(secondRoom.Id, user.Id,
                TestHelper.Tomorrow(10, 30), TestHelper.Tomorrow(11, 30));

            // Act
            var result = await controller.CreateReservation(dto);

            // Assert: conflict is reported and only the original reservation remains
            AssertError(result, 409, "ORGANIZER_BOOKING_CONFLICT");
            Assert.Single(context.Reservations);
        }

        // 9
        /// <summary>
        /// Cancelling a booked reservation changes its status to Cancelled.
        /// </summary>
        [Fact]
        public async Task CancelReservation_ShouldChangeStatusToCancelled()
        {
            // Arrange: an existing booked reservation
            using var context = TestHelper.CreateContext();
            var room = TestHelper.AddRoom(context);
            var user = TestHelper.AddUser(context);
            var reservation = TestHelper.AddReservation(context, room.Id, user.Id,
                TestHelper.Tomorrow(10), TestHelper.Tomorrow(11));
            var controller = CreateController(context);

            // Act
            var result = await controller.CancelReservation(reservation.Id);

            // Assert: 204 No Content is returned and the status is persisted as Cancelled
            Assert.IsType<NoContentResult>(result);
            var saved = await context.Reservations.FindAsync(reservation.Id);
            Assert.NotNull(saved);
            Assert.Equal(ReservationStatus.Cancelled, saved!.Status);
        }

        // 10
        /// <summary>
        /// Cancelling a reservation that does not exist returns 404 Not Found.
        /// </summary>
        [Fact]
        public async Task CancelReservation_ShouldFail_WhenReservationDoesNotExist()
        {
            // Arrange: an empty database
            using var context = TestHelper.CreateContext();
            var controller = CreateController(context);

            // Act
            var result = await controller.CancelReservation(999);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        // 11
        /// <summary>
        /// Ending an in-progress reservation early sets its status to Completed
        /// and updates the planned end time to the current time.
        /// </summary>
        [Fact]
        public async Task EndEarly_ShouldSetReservationAsCompleted()
        {
            // Arrange: a reservation that started 30 minutes ago and ends in one hour
            using var context = TestHelper.CreateContext();
            var room = TestHelper.AddRoom(context);
            var user = TestHelper.AddUser(context);
            var originalEnd = DateTime.Now.AddHours(1);
            var reservation = TestHelper.AddReservation(context, room.Id, user.Id,
                DateTime.Now.AddMinutes(-30), originalEnd);
            var controller = CreateController(context);

            // Act: measure the time window in which the end time is expected to be set
            var before = DateTime.Now;
            var result = await controller.EndReservationEarly(reservation.Id);
            var after = DateTime.Now;

            // Assert: status is Completed and PlannedEnd was moved to "now", earlier than the original end
            Assert.IsType<NoContentResult>(result);
            var saved = await context.Reservations.FindAsync(reservation.Id);
            Assert.NotNull(saved);
            Assert.Equal(ReservationStatus.Completed, saved!.Status);
            Assert.True(saved.PlannedEnd >= before && saved.PlannedEnd <= after,
                "PlannedEnd should be updated to the current time.");
            Assert.True(saved.PlannedEnd < originalEnd);
        }

        // 12
        /// <summary>
        /// A reservation that is not currently in progress cannot be ended early.
        /// Covers two scenarios: the reservation has not started yet, or it has already ended.
        /// </summary>
        /// <param name="startOffsetMinutes">Start time offset from now, in minutes.</param>
        /// <param name="endOffsetMinutes">End time offset from now, in minutes.</param>
        [Theory]
        [InlineData(60, 120)]   // not started yet
        [InlineData(-120, -60)] // already ended
        public async Task EndEarly_ShouldFail_WhenReservationNotInProgress(
            int startOffsetMinutes,
            int endOffsetMinutes)
        {
            // Arrange: a booked reservation entirely in the future or entirely in the past
            using var context = TestHelper.CreateContext();
            var room = TestHelper.AddRoom(context);
            var user = TestHelper.AddUser(context);
            var start = DateTime.Now.AddMinutes(startOffsetMinutes);
            var end = DateTime.Now.AddMinutes(endOffsetMinutes);
            var reservation = TestHelper.AddReservation(context, room.Id, user.Id, start, end);
            var controller = CreateController(context);

            // Act
            var result = await controller.EndReservationEarly(reservation.Id);

            // Assert: 400 RESERVATION_NOT_IN_PROGRESS is returned
            var objectResult = Assert.IsAssignableFrom<ObjectResult>(result);
            Assert.Equal(400, objectResult.StatusCode);
            var error = Assert.IsType<ErrorResponseDto>(objectResult.Value);
            Assert.Equal("RESERVATION_NOT_IN_PROGRESS", error.ErrorCode);

            // ...and the reservation remains unchanged
            var saved = await context.Reservations.FindAsync(reservation.Id);
            Assert.Equal(ReservationStatus.Booked, saved!.Status);
            Assert.Equal(end, saved.PlannedEnd);
        }
    }
}