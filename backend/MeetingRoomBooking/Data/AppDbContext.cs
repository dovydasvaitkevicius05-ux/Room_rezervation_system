using Microsoft.EntityFrameworkCore;
using MeetingRoomBooking.Models;


namespace MeetingRoomBooking.Data
{
    public class AppDbContext : DbContext
    {
        /// <summary>
        /// Geting configuration for database
        /// </summary>
        /// <param name="options">Database configuration</param>
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        /// <summary>
        /// Reservations in database
        /// </summary>
        public DbSet<Reservation> Reservations { get; set; }

        /// <summary>
        /// Rooms in database
        /// </summary>
        public DbSet<Room> Rooms { get; set; }

        /// <summary>
        /// Users in database
        /// </summary>
        public DbSet<User> Users { get; set; }

    }
}
