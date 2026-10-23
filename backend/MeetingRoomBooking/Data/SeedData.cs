using MeetingRoomBooking.Models;
using MeetingRoomBooking.Models.Enums;

namespace MeetingRoomBooking.Data
{
    public static class SeedData
    {
        public static void Initialize(AppDbContext context)
        {
            if (context.Rooms.Any())
            {
                return;
            }

            // Rooms
            var rooms = new List<Room>
            {
                new Room
                {
                    Id = 1,
                    Name = "Alpha",
                    MaxCapacity = 6,
                    Floor = 1,
                    Location = "North Wing",
                    Equipment = new()
                    {
                        RoomEquipment.Projector
                    },
                    Status = RoomStatus.Active
                },

                new Room
                {
                    Id = 2,
                    Name = "Beta",
                    MaxCapacity = 10,
                    Floor = 1,
                    Location = "South Wing",
                    Equipment = new()
                    {
                        RoomEquipment.Projector,
                        RoomEquipment.Whiteboard
                    },
                    Status = RoomStatus.Active
                },

                new Room
                {
                    Id = 3,
                    Name = "Gamma",
                    MaxCapacity = 15,
                    Floor = 2,
                    Location = "East Wing",
                    Equipment = new()
                    {
                        RoomEquipment.TVScreen
                    },
                    Status = RoomStatus.Active
                },

                new Room
                {
                    Id = 4,
                    Name = "Delta",
                    MaxCapacity = 20,
                    Floor = 2,
                    Location = "West Wing",
                    Equipment = new()
                    {
                        RoomEquipment.TVScreen,
                        RoomEquipment.Whiteboard
                    },
                    Status = RoomStatus.Active
                },

                new Room
                {
                    Id = 5,
                    Name = "Omega",
                    MaxCapacity = 30,
                    Floor = 3,
                    Location = "Central Wing",
                    Equipment = new()
                    {
                        RoomEquipment.Projector,
                        RoomEquipment.TVScreen,
                        RoomEquipment.VideoConferencing,
                        RoomEquipment.Whiteboard
                    },
                    Status = RoomStatus.Active
                },

                new Room
                {
                    Id = 6,
                    Name = "Orion",
                    MaxCapacity = 12,
                    Floor = 3,
                    Location = "North Wing",
                    Equipment = new()
                    {
                        RoomEquipment.Projector,
                        RoomEquipment.VideoConferencing
                    },
                    Status = RoomStatus.Active
                },

                new Room
                {
                    Id = 7,
                    Name = "Nova",
                    MaxCapacity = 8,
                    Floor = 4,
                    Location = "South Wing",
                    Equipment = new()
                    {
                        RoomEquipment.Whiteboard
                    },
                    Status = RoomStatus.Active
                },

                new Room
                {
                    Id = 8,
                    Name = "Phoenix",
                    MaxCapacity = 25,
                    Floor = 4,
                    Location = "Executive Area",
                    Equipment = new()
                    {
                        RoomEquipment.Projector,
                        RoomEquipment.TVScreen,
                        RoomEquipment.VideoConferencing
                    },
                    Status = RoomStatus.Inactive
                }
            };

            context.Rooms.AddRange(rooms);

            // Users
            var users = new List<User>
            {
                new User { Id = 1, Name = "Jonas", Surname = "Jonaitis" },
                new User { Id = 2, Name = "Petras", Surname = "Petraitis" },
                new User { Id = 3, Name = "Ona", Surname = "Onaitė" },
                new User { Id = 4, Name = "Ieva", Surname = "Kazlauskaitė" },
                new User { Id = 5, Name = "Tomas", Surname = "Tomaitis" },
                new User { Id = 6, Name = "Mantas", Surname = "Mantaitis" },
                new User { Id = 7, Name = "Laura", Surname = "Laurinavičiūtė" },
                new User { Id = 8, Name = "Rūta", Surname = "Rutkauskaitė" },
                new User { Id = 9, Name = "Andrius", Surname = "Andriuškevičius" },
                new User { Id = 10, Name = "Lina", Surname = "Linaitė" }
            };

            context.Users.AddRange(users);

            // Reservations
            var reservations = new List<Reservation>
            {
                new Reservation()
                {
                    Id = 1,
                    RoomId = 1,
                    OrganizerId = 1,
                    Title = "Conference",
                    PlannedStart = new DateTime(2026, 11, 10, 7, 0, 0),
                    PlannedEnd = new DateTime(2026, 11, 11, 7, 0, 0),
                    ParticipantCount = 2,
                    Status = ReservationStatus.Booked
                }

            };

            context.Reservations.AddRange(reservations);

            context.SaveChanges();
        }
    }
}