using Microsoft.EntityFrameworkCore;
using MeetingRoomBooking.Models;

namespace MeetingRoomBooking.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<User> Users { get; set; }

        /// <summary>
        /// Configurating connection and foreign key between User and Reservation
        /// </summary>
        /// <param name="modelBuilder"></param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasMany(u => u.OrganizedReservations)
                .WithOne()
                .HasForeignKey(r => r.OrganizerId);
        }
    }
}