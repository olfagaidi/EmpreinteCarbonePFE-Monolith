using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EmpreintCarbone.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EmpreintCarbone.Infrastructure
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
   
            Users = Set<User>();
            TransportData = Set<TransportData>();
            WarehouseData = Set<WarehouseData>();
            PackagingData = Set<PackagingData>();
            WasteData = Set<WasteData>();
            EnergyData = Set<EnergyData>();
            PrintingData = Set<PrintingData>();


        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasMany(u => u.TransportData)
                .WithOne(t => t.User)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

               modelBuilder.Entity<User>()
              .HasMany(u => u.WarehouseData)
              .WithOne(w => w.User)     
              .HasForeignKey(w => w.UserId)
              .OnDelete(DeleteBehavior.Cascade);

                 modelBuilder.Entity<User>()
               .HasMany<PackagingData>()
               .WithOne(w => w.User)
               .HasForeignKey(w => w.UserId)
               .OnDelete(DeleteBehavior.Cascade);

                modelBuilder.Entity<User>()
               .HasMany(u => u.WasteData)
               .WithOne(w => w.User)
               .HasForeignKey(w => w.UserId)
               .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<User>()
             .HasMany<EnergyData>()
             .WithOne(e => e.User)
             .HasForeignKey(e => e.UserId)
             .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<User>()
                .HasMany(u => u.PrintingData)
                .WithOne(p => p.User)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

        }

        public DbSet<User> Users { get; set; }
        public DbSet<TransportData> TransportData { get; set; }
        public DbSet<WarehouseData> WarehouseData { get; set; }

        public DbSet<PackagingData> PackagingData { get; set; }

        public DbSet<WasteData> WasteData { get; set; }

        public DbSet<EnergyData> EnergyData { get; set; }
        public DbSet<PrintingData> PrintingData { get; set; }

    }
}
