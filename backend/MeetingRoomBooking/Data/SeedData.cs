using MeetingRoomBooking.Models;
using MeetingRoomBooking.Models.Enums;

namespace MeetingRoomBooking.Data
{
    /// <summary>
    /// Provides sample data for rooms, users, and reservations.
    /// Populates the database only when no rooms exist.
    /// </summary>
    public static class SeedData
    {
        /// <summary>
        /// Initialize the database with sample data for development and testing.
        /// </summary>
        public static void Initialize(AppDbContext context)
        {
            // Prevent duplicate seed data when rooms already exist.
            if (context.Rooms.Any())
            {
                return;
            }

            // Create rooms with different capacities, locations, and equipment.
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
                        RoomEquipment.Projector,
                    },
                    Status = RoomStatus.Active,
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
                        RoomEquipment.Whiteboard,
                    },
                    Status = RoomStatus.Active,
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
                        RoomEquipment.TVScreen,
                    },
                    Status = RoomStatus.Active,
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
                        RoomEquipment.Whiteboard,
                    },
                    Status = RoomStatus.Active,
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
                        RoomEquipment.Whiteboard,
                    },
                    Status = RoomStatus.Active,
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
                        RoomEquipment.VideoConferencing,
                    },
                    Status = RoomStatus.Active,
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
                        RoomEquipment.Whiteboard,
                    },
                    Status = RoomStatus.Active,
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
                        RoomEquipment.VideoConferencing,
                    },
                    Status = RoomStatus.Inactive,
                },
                new Room
                {
                    Id = 9,
                    Name = "Aurora",
                    MaxCapacity = 4,
                    Floor = 1,
                    Location = "Innovation Hub",
                    Equipment = new()
                    {
                        RoomEquipment.Whiteboard,
                    },
                    Status = RoomStatus.Active,
                },
                new Room
                {
                    Id = 10,
                    Name = "Horizon",
                    MaxCapacity = 16,
                    Floor = 2,
                    Location = "East Wing",
                    Equipment = new()
                    {
                        RoomEquipment.Projector,
                        RoomEquipment.Whiteboard,
                        RoomEquipment.VideoConferencing,
                    },
                    Status = RoomStatus.Active,
                },
                new Room
                {
                    Id = 11,
                    Name = "Atlas",
                    MaxCapacity = 40,
                    Floor = 5,
                    Location = "Conference Center",
                    Equipment = new()
                    {
                        RoomEquipment.Projector,
                        RoomEquipment.TVScreen,
                        RoomEquipment.VideoConferencing,
                        RoomEquipment.Whiteboard,
                    },
                    Status = RoomStatus.Active,
                },
                new Room
                {
                    Id = 12,
                    Name = "Luna",
                    MaxCapacity = 14,
                    Floor = 3,
                    Location = "West Wing",
                    Equipment = new()
                    {
                        RoomEquipment.TVScreen,
                        RoomEquipment.Whiteboard,
                    },
                    Status = RoomStatus.Active,
                },
            };

            context.Rooms.AddRange(rooms);

            // Add users with varied Lithuanian and international names.
            var users = new List<User>
            {
                new User { Id = 1, Name = "Austėja", Surname = "Jankauskaitė" },
                new User { Id = 2, Name = "Lukas", Surname = "Petrauskas" },
                new User { Id = 3, Name = "Emilija", Surname = "Kazlauskaitė" },
                new User { Id = 4, Name = "Matas", Surname = "Žukauskas" },
                new User { Id = 5, Name = "Gabija", Surname = "Stankevičiūtė" },
                new User { Id = 6, Name = "Nojus", Surname = "Vasiliauskas" },
                new User { Id = 7, Name = "Liepa", Surname = "Butkutė" },
                new User { Id = 8, Name = "Dominykas", Surname = "Paulauskas" },
                new User { Id = 9, Name = "Ugnė", Surname = "Rimkutė" },
                new User { Id = 10, Name = "Benas", Surname = "Kavaliauskas" },
                new User { Id = 11, Name = "Sofia", Surname = "Müller" },
                new User { Id = 12, Name = "Oliver", Surname = "Smith" },
                new User { Id = 13, Name = "Isabella", Surname = "Rossi" },
                new User { Id = 14, Name = "Lucas", Surname = "Martin" },
                new User { Id = 15, Name = "Amelia", Surname = "Wilson" },
                new User { Id = 16, Name = "Gabrielius", Surname = "Balčiūnas" },
                new User { Id = 17, Name = "Viktorija", Surname = "Navickaitė" },
                new User { Id = 18, Name = "Dovydas", Surname = "Grigaitis" },
                new User { Id = 19, Name = "Eglė", Surname = "Mikalauskienė" },
                new User { Id = 20, Name = "Karolis", Surname = "Urbonas" },
            };

            context.Users.AddRange(users);

            // Add reservations with varied dates, organizers, and statuses.
            var reservations = new List<Reservation>
            {
                new Reservation
                {
                    Id = 1,
                    RoomId = 1,
                    OrganizerId = 1,
                    Title = "Weekly Team Stand-up",
                    PlannedStart = new DateTime(2026, 11, 2, 9, 0, 0),
                    PlannedEnd = new DateTime(2026, 11, 2, 9, 30, 0),
                    ParticipantCount = 5,
                    Status = ReservationStatus.Completed,
                },
                new Reservation
                {
                    Id = 2,
                    RoomId = 1,
                    OrganizerId = 2,
                    Title = "Sprint Planning",
                    PlannedStart = new DateTime(2026, 11, 4, 10, 0, 0),
                    PlannedEnd = new DateTime(2026, 11, 4, 12, 0, 0),
                    ParticipantCount = 6,
                    Status = ReservationStatus.Completed,
                },
                new Reservation
                {
                    Id = 3,
                    RoomId = 2,
                    OrganizerId = 3,
                    Title = "Marketing Campaign Review",
                    PlannedStart = new DateTime(2026, 11, 3, 9, 0, 0),
                    PlannedEnd = new DateTime(2026, 11, 3, 10, 30, 0),
                    ParticipantCount = 8,
                    Status = ReservationStatus.Completed,
                },
                new Reservation
                {
                    Id = 4,
                    RoomId = 2,
                    OrganizerId = 4,
                    Title = "Quarterly Budget Planning",
                    PlannedStart = new DateTime(2026, 11, 5, 13, 0, 0),
                    PlannedEnd = new DateTime(2026, 11, 5, 15, 0, 0),
                    ParticipantCount = 7,
                    Status = ReservationStatus.Cancelled,
                },
                new Reservation
                {
                    Id = 5,
                    RoomId = 3,
                    OrganizerId = 5,
                    Title = "Customer Feedback Analysis",
                    PlannedStart = new DateTime(2026, 11, 6, 10, 0, 0),
                    PlannedEnd = new DateTime(2026, 11, 6, 12, 0, 0),
                    ParticipantCount = 12,
                    Status = ReservationStatus.Completed,
                },
                new Reservation
                {
                    Id = 6,
                    RoomId = 4,
                    OrganizerId = 6,
                    Title = "Software Architecture Review",
                    PlannedStart = new DateTime(2026, 11, 9, 9, 0, 0),
                    PlannedEnd = new DateTime(2026, 11, 9, 11, 0, 0),
                    ParticipantCount = 15,
                    Status = ReservationStatus.Booked,
                },
                new Reservation
                {
                    Id = 7,
                    RoomId = 5,
                    OrganizerId = 7,
                    Title = "Company Onboarding",
                    PlannedStart = new DateTime(2026, 11, 10, 8, 0, 0),
                    PlannedEnd = new DateTime(2026, 11, 10, 16, 0, 0),
                    ParticipantCount = 25,
                    Status = ReservationStatus.Booked,
                },
                new Reservation
                {
                    Id = 8,
                    RoomId = 5,
                    OrganizerId = 8,
                    Title = "Executive Strategy Meeting",
                    PlannedStart = new DateTime(2026, 11, 11, 10, 0, 0),
                    PlannedEnd = new DateTime(2026, 11, 11, 12, 0, 0),
                    ParticipantCount = 18,
                    Status = ReservationStatus.Booked,
                },
                new Reservation
                {
                    Id = 9,
                    RoomId = 5,
                    OrganizerId = 9,
                    Title = "Annual Business Planning",
                    PlannedStart = new DateTime(2026, 11, 12, 9, 0, 0),
                    PlannedEnd = new DateTime(2026, 11, 12, 13, 0, 0),
                    ParticipantCount = 20,
                    Status = ReservationStatus.Booked,
                },
                new Reservation
                {
                    Id = 10,
                    RoomId = 6,
                    OrganizerId = 10,
                    Title = "International Partner Call",
                    PlannedStart = new DateTime(2026, 11, 13, 14, 0, 0),
                    PlannedEnd = new DateTime(2026, 11, 13, 15, 30, 0),
                    ParticipantCount = 8,
                    Status = ReservationStatus.Booked,
                },
                new Reservation
                {
                    Id = 11,
                    RoomId = 7,
                    OrganizerId = 11,
                    Title = "UX Design Workshop",
                    PlannedStart = new DateTime(2026, 11, 16, 10, 0, 0),
                    PlannedEnd = new DateTime(2026, 11, 16, 12, 0, 0),
                    ParticipantCount = 7,
                    Status = ReservationStatus.Booked,
                },
                new Reservation
                {
                    Id = 12,
                    RoomId = 9,
                    OrganizerId = 12,
                    Title = "One-on-One Meeting",
                    PlannedStart = new DateTime(2026, 11, 17, 9, 0, 0),
                    PlannedEnd = new DateTime(2026, 11, 17, 9, 45, 0),
                    ParticipantCount = 2,
                    Status = ReservationStatus.Booked,
                },
                new Reservation
                {
                    Id = 13,
                    RoomId = 10,
                    OrganizerId = 13,
                    Title = "Product Roadmap Discussion",
                    PlannedStart = new DateTime(2026, 11, 18, 10, 0, 0),
                    PlannedEnd = new DateTime(2026, 11, 18, 12, 0, 0),
                    ParticipantCount = 14,
                    Status = ReservationStatus.Booked,
                },
                new Reservation
                {
                    Id = 14,
                    RoomId = 11,
                    OrganizerId = 14,
                    Title = "Company Town Hall",
                    PlannedStart = new DateTime(2026, 11, 19, 13, 0, 0),
                    PlannedEnd = new DateTime(2026, 11, 19, 15, 0, 0),
                    ParticipantCount = 35,
                    Status = ReservationStatus.Booked,
                },
                new Reservation
                {
                    Id = 15,
                    RoomId = 12,
                    OrganizerId = 15,
                    Title = "Design System Review",
                    PlannedStart = new DateTime(2026, 11, 20, 11, 0, 0),
                    PlannedEnd = new DateTime(2026, 11, 20, 12, 30, 0),
                    ParticipantCount = 10,
                    Status = ReservationStatus.Booked,
                },
                new Reservation
                {
                    Id = 16,
                    RoomId = 1,
                    OrganizerId = 16,
                    Title = "Code Review",
                    PlannedStart = new DateTime(2026, 11, 23, 10, 0, 0),
                    PlannedEnd = new DateTime(2026, 11, 23, 11, 0, 0),
                    ParticipantCount = 4,
                    Status = ReservationStatus.Booked,
                },
                new Reservation
                {
                    Id = 17,
                    RoomId = 2,
                    OrganizerId = 17,
                    Title = "Sales Performance Review",
                    PlannedStart = new DateTime(2026, 11, 24, 9, 0, 0),
                    PlannedEnd = new DateTime(2026, 11, 24, 10, 30, 0),
                    ParticipantCount = 9,
                    Status = ReservationStatus.Booked,
                },
                new Reservation
                {
                    Id = 18,
                    RoomId = 3,
                    OrganizerId = 18,
                    Title = "Technical Interview",
                    PlannedStart = new DateTime(2026, 11, 25, 13, 0, 0),
                    PlannedEnd = new DateTime(2026, 11, 25, 14, 0, 0),
                    ParticipantCount = 3,
                    Status = ReservationStatus.Booked,
                },
                new Reservation
                {
                    Id = 19,
                    RoomId = 4,
                    OrganizerId = 19,
                    Title = "Department Planning",
                    PlannedStart = new DateTime(2026, 11, 26, 10, 0, 0),
                    PlannedEnd = new DateTime(2026, 11, 26, 12, 0, 0),
                    ParticipantCount = 16,
                    Status = ReservationStatus.Booked,
                },
                new Reservation
                {
                    Id = 20,
                    RoomId = 6,
                    OrganizerId = 20,
                    Title = "Infrastructure Maintenance Review",
                    PlannedStart = new DateTime(2026, 11, 27, 9, 0, 0),
                    PlannedEnd = new DateTime(2026, 11, 27, 10, 30, 0),
                    ParticipantCount = 6,
                    Status = ReservationStatus.Booked,
                },
                new Reservation
                {
                    Id = 21,
                    RoomId = 7,
                    OrganizerId = 1,
                    Title = "Content Planning",
                    PlannedStart = new DateTime(2026, 11, 30, 10, 0, 0),
                    PlannedEnd = new DateTime(2026, 11, 30, 11, 30, 0),
                    ParticipantCount = 6,
                    Status = ReservationStatus.Booked,
                },
                new Reservation
                {
                    Id = 22,
                    RoomId = 9,
                    OrganizerId = 2,
                    Title = "Project Kick-off",
                    PlannedStart = new DateTime(2026, 12, 1, 9, 0, 0),
                    PlannedEnd = new DateTime(2026, 12, 1, 10, 0, 0),
                    ParticipantCount = 4,
                    Status = ReservationStatus.Booked,
                },
                new Reservation
                {
                    Id = 23,
                    RoomId = 10,
                    OrganizerId = 3,
                    Title = "Research Findings Presentation",
                    PlannedStart = new DateTime(2026, 12, 2, 11, 0, 0),
                    PlannedEnd = new DateTime(2026, 12, 2, 12, 30, 0),
                    ParticipantCount = 12,
                    Status = ReservationStatus.Booked,
                },
                new Reservation
                {
                    Id = 24,
                    RoomId = 11,
                    OrganizerId = 4,
                    Title = "Leadership Workshop",
                    PlannedStart = new DateTime(2026, 12, 3, 9, 0, 0),
                    PlannedEnd = new DateTime(2026, 12, 3, 12, 0, 0),
                    ParticipantCount = 30,
                    Status = ReservationStatus.Booked,
                },
                new Reservation
                {
                    Id = 25,
                    RoomId = 12,
                    OrganizerId = 5,
                    Title = "Customer Success Meeting",
                    PlannedStart = new DateTime(2026, 12, 4, 14, 0, 0),
                    PlannedEnd = new DateTime(2026, 12, 4, 15, 0, 0),
                    ParticipantCount = 8,
                    Status = ReservationStatus.Booked,
                },
                new Reservation
                {
                    Id = 26,
                    RoomId = 1,
                    OrganizerId = 6,
                    Title = "Daily Operations Sync",
                    PlannedStart = new DateTime(2026, 12, 7, 9, 0, 0),
                    PlannedEnd = new DateTime(2026, 12, 7, 9, 30, 0),
                    ParticipantCount = 5,
                    Status = ReservationStatus.Booked,
                },
                new Reservation
                {
                    Id = 27,
                    RoomId = 2,
                    OrganizerId = 7,
                    Title = "Hiring Pipeline Review",
                    PlannedStart = new DateTime(2026, 12, 8, 10, 0, 0),
                    PlannedEnd = new DateTime(2026, 12, 8, 11, 0, 0),
                    ParticipantCount = 6,
                    Status = ReservationStatus.Booked,
                },
                new Reservation
                {
                    Id = 28,
                    RoomId = 3,
                    OrganizerId = 8,
                    Title = "Mobile App Demonstration",
                    PlannedStart = new DateTime(2026, 12, 9, 13, 0, 0),
                    PlannedEnd = new DateTime(2026, 12, 9, 14, 30, 0),
                    ParticipantCount = 10,
                    Status = ReservationStatus.Booked,
                },
                new Reservation
                {
                    Id = 29,
                    RoomId = 4,
                    OrganizerId = 9,
                    Title = "Security Review",
                    PlannedStart = new DateTime(2026, 12, 10, 9, 0, 0),
                    PlannedEnd = new DateTime(2026, 12, 10, 11, 0, 0),
                    ParticipantCount = 12,
                    Status = ReservationStatus.Booked,
                },
                new Reservation
                {
                    Id = 30,
                    RoomId = 5,
                    OrganizerId = 10,
                    Title = "End-of-Year Retrospective",
                    PlannedStart = new DateTime(2026, 12, 11, 13, 0, 0),
                    PlannedEnd = new DateTime(2026, 12, 11, 15, 0, 0),
                    ParticipantCount = 28,
                    Status = ReservationStatus.Booked,
                },
                new Reservation
                {
                    Id = 31,
                    RoomId = 6,
                    OrganizerId = 11,
                    Title = "Vendor Evaluation",
                    PlannedStart = new DateTime(2026, 12, 14, 10, 0, 0),
                    PlannedEnd = new DateTime(2026, 12, 14, 11, 30, 0),
                    ParticipantCount = 9,
                    Status = ReservationStatus.Booked,
                },
                new Reservation
                {
                    Id = 32,
                    RoomId = 7,
                    OrganizerId = 12,
                    Title = "Creative Brainstorming",
                    PlannedStart = new DateTime(2026, 12, 15, 9, 0, 0),
                    PlannedEnd = new DateTime(2026, 12, 15, 10, 30, 0),
                    ParticipantCount = 8,
                    Status = ReservationStatus.Booked,
                },
                new Reservation
                {
                    Id = 33,
                    RoomId = 9,
                    OrganizerId = 13,
                    Title = "Mentoring Session",
                    PlannedStart = new DateTime(2026, 12, 16, 14, 0, 0),
                    PlannedEnd = new DateTime(2026, 12, 16, 15, 0, 0),
                    ParticipantCount = 2,
                    Status = ReservationStatus.Cancelled,
                },
                new Reservation
                {
                    Id = 34,
                    RoomId = 10,
                    OrganizerId = 14,
                    Title = "API Integration Workshop",
                    PlannedStart = new DateTime(2026, 12, 17, 10, 0, 0),
                    PlannedEnd = new DateTime(2026, 12, 17, 12, 0, 0),
                    ParticipantCount = 15,
                    Status = ReservationStatus.Booked,
                },
                new Reservation
                {
                    Id = 35,
                    RoomId = 11,
                    OrganizerId = 15,
                    Title = "Annual Company Meeting",
                    PlannedStart = new DateTime(2026, 12, 18, 9, 0, 0),
                    PlannedEnd = new DateTime(2026, 12, 18, 12, 0, 0),
                    ParticipantCount = 40,
                    Status = ReservationStatus.Booked,
                },
                new Reservation
                {
                    Id = 36,
                    RoomId = 12,
                    OrganizerId = 16,
                    Title = "Release Readiness Review",
                    PlannedStart = new DateTime(2026, 12, 21, 11, 0, 0),
                    PlannedEnd = new DateTime(2026, 12, 21, 12, 30, 0),
                    ParticipantCount = 11,
                    Status = ReservationStatus.Booked,
                },
                new Reservation
                {
                    Id = 37,
                    RoomId = 1,
                    OrganizerId = 17,
                    Title = "Requirements Clarification",
                    PlannedStart = new DateTime(2026, 12, 22, 9, 0, 0),
                    PlannedEnd = new DateTime(2026, 12, 22, 10, 0, 0),
                    ParticipantCount = 4,
                    Status = ReservationStatus.Cancelled,
                },
                new Reservation
                {
                    Id = 38,
                    RoomId = 2,
                    OrganizerId = 18,
                    Title = "Customer Support Retrospective",
                    PlannedStart = new DateTime(2026, 12, 23, 13, 0, 0),
                    PlannedEnd = new DateTime(2026, 12, 23, 14, 30, 0),
                    ParticipantCount = 8,
                    Status = ReservationStatus.Booked,
                },
                new Reservation
                {
                    Id = 39,
                    RoomId = 4,
                    OrganizerId = 19,
                    Title = "Performance Testing Review",
                    PlannedStart = new DateTime(2026, 12, 28, 10, 0, 0),
                    PlannedEnd = new DateTime(2026, 12, 28, 12, 0, 0),
                    ParticipantCount = 18,
                    Status = ReservationStatus.Booked,
                },
                new Reservation
                {
                    Id = 40,
                    RoomId = 5,
                    OrganizerId = 20,
                    Title = "New Year Planning Session",
                    PlannedStart = new DateTime(2026, 12, 29, 9, 0, 0),
                    PlannedEnd = new DateTime(2026, 12, 29, 11, 0, 0),
                    ParticipantCount = 24,
                    Status = ReservationStatus.Booked,
                },
            };

            context.Reservations.AddRange(reservations);

            // Persist all seeded entities to the database.
            context.SaveChanges();
        }
    }
}