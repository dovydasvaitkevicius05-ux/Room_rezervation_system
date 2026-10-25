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
                },
                new Reservation()
                {
                    Id = 2,
                    RoomId = 1,
                    OrganizerId = 2,
                    Title = "Sprint Review",
                    PlannedStart = new DateTime(2026, 11, 12, 9, 0, 0),
                    PlannedEnd = new DateTime(2026, 11, 12, 11, 0, 0),
                    ParticipantCount = 4,
                    Status = ReservationStatus.Completed
                },

                new Reservation()
                {
                    Id = 3,
                    RoomId = 2,
                    OrganizerId = 3,
                    Title = "Marketing Meeting",
                    PlannedStart = new DateTime(2026, 11, 13, 8, 0, 0),
                    PlannedEnd = new DateTime(2026, 11, 13, 10, 0, 0),
                    ParticipantCount = 8,
                    Status = ReservationStatus.Completed
                },

                new Reservation()
                {
                    Id = 4,
                    RoomId = 2,
                    OrganizerId = 4,
                    Title = "Budget Planning",
                    PlannedStart = new DateTime(2026, 11, 14, 13, 0, 0),
                    PlannedEnd = new DateTime(2026, 11, 14, 15, 0, 0),
                    ParticipantCount = 7,
                    Status = ReservationStatus.Cancelled
                },

                new Reservation()
                {
                    Id = 5,
                    RoomId = 3,
                    OrganizerId = 5,
                    Title = "Customer Presentation",
                    PlannedStart = new DateTime(2026, 11, 15, 10, 0, 0),
                    PlannedEnd = new DateTime(2026, 11, 15, 12, 0, 0),
                    ParticipantCount = 12,
                    Status = ReservationStatus.Completed
                },

                new Reservation()
                {
                    Id = 6,
                    RoomId = 4,
                    OrganizerId = 6,
                    Title = "Architecture Review",
                    PlannedStart = new DateTime(2026, 11, 16, 9, 0, 0),
                    PlannedEnd = new DateTime(2026, 11, 16, 12, 0, 0),
                    ParticipantCount = 10,
                    Status = ReservationStatus.Booked
                },

                new Reservation()
                {
                    Id = 7,
                    RoomId = 5,
                    OrganizerId = 7,
                    Title = "Company Training",
                    PlannedStart = new DateTime(2026, 11, 17, 8, 0, 0),
                    PlannedEnd = new DateTime(2026, 11, 17, 16, 0, 0),
                    ParticipantCount = 25,
                    Status = ReservationStatus.Completed
                },

                new Reservation()
                {
                    Id = 8,
                    RoomId = 5,
                    OrganizerId = 8,
                    Title = "Executive Meeting",
                    PlannedStart = new DateTime(2026, 11, 18, 10, 0, 0),
                    PlannedEnd = new DateTime(2026, 11, 18, 12, 0, 0),
                    ParticipantCount = 18,
                    Status = ReservationStatus.Completed
                },

                new Reservation()
                {
                    Id = 9,
                    RoomId = 5,
                    OrganizerId = 9,
                    Title = "Annual Strategy Session",
                    PlannedStart = new DateTime(2026, 11, 19, 9, 0, 0),
                    PlannedEnd = new DateTime(2026, 11, 19, 13, 0, 0),
                    ParticipantCount = 20,
                    Status = ReservationStatus.Booked
                },

                new Reservation()
                {
                    Id = 10,
                    RoomId = 6,
                    OrganizerId = 10,
                    Title = "Remote Partner Call",
                    PlannedStart = new DateTime(2026, 11, 20, 14, 0, 0),
                    PlannedEnd = new DateTime(2026, 11, 20, 16, 0, 0),
                    ParticipantCount = 8,
                    Status = ReservationStatus.Completed
                },

                new Reservation()
                {
                    Id = 11,
                    RoomId = 7,
                    OrganizerId = 3,
                    Title = "Documentation Review",
                    PlannedStart = new DateTime(2026, 11, 21, 9, 0, 0),
                    PlannedEnd = new DateTime(2026, 11, 21, 10, 30, 0),
                    ParticipantCount = 5,
                    Status = ReservationStatus.Cancelled
                }

            };

            context.Reservations.AddRange(reservations);

            context.SaveChanges();
        }
    }
}