using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EmpreintCarbone.Infrastructure.Migrations
{
    public partial class AddParametreProfil : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PasswordHash = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    PasswordSalt = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    Is_Verified = table.Column<bool>(type: "bit", nullable: false),
                    User_Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Is_Archived = table.Column<bool>(type: "bit", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BirthDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    JobTitle = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Department = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Location = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Manager = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Photo = table.Column<byte[]>(type: "varbinary(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EnergyData",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EnergyType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ElectricityConsumption = table.Column<double>(type: "float", nullable: false),
                    HeatingConsumption = table.Column<double>(type: "float", nullable: false),
                    Unit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Emission = table.Column<double>(type: "float", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EnergyData", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EnergyData_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PackagingData",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PackagingType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Weight = table.Column<double>(type: "float", nullable: true),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    DateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UnitWeight = table.Column<double>(type: "float", nullable: true),
                    PalletCount = table.Column<int>(type: "int", nullable: true),
                    PalletWeight = table.Column<double>(type: "float", nullable: true),
                    PalletType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Emission = table.Column<double>(type: "float", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PackagingData", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PackagingData_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PrintingData",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PrintType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    PaperType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Emission = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrintingData", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PrintingData_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TransportData",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Distance = table.Column<double>(type: "float", nullable: false),
                    VehicleType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FuelType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Consumption = table.Column<double>(type: "float", nullable: false),
                    LoadFactor = table.Column<double>(type: "float", nullable: false),
                    DepartureLocation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ArrivalLocation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Emission = table.Column<double>(type: "float", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DateTime = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransportData", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TransportData_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WarehouseData",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Area = table.Column<double>(type: "float", nullable: false),
                    EnergyType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EnergyConsumption = table.Column<double>(type: "float", nullable: false),
                    HeatingConsumption = table.Column<double>(type: "float", nullable: false),
                    DateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Emission = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WarehouseData", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WarehouseData_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WasteData",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    WasteType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Quantity = table.Column<double>(type: "float", nullable: false),
                    TreatmentMethod = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Emission = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WasteData", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WasteData_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EnergyData_UserId",
                table: "EnergyData",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_PackagingData_UserId",
                table: "PackagingData",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_PrintingData_UserId",
                table: "PrintingData",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_TransportData_UserId",
                table: "TransportData",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_WarehouseData_UserId",
                table: "WarehouseData",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_WasteData_UserId",
                table: "WasteData",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EnergyData");

            migrationBuilder.DropTable(
                name: "PackagingData");

            migrationBuilder.DropTable(
                name: "PrintingData");

            migrationBuilder.DropTable(
                name: "TransportData");

            migrationBuilder.DropTable(
                name: "WarehouseData");

            migrationBuilder.DropTable(
                name: "WasteData");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
