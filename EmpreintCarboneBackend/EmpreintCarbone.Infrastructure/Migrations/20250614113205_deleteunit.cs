using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EmpreintCarbone.Infrastructure.Migrations
{
    public partial class deleteunit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UnitWeight",
                table: "PackagingData");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "UnitWeight",
                table: "PackagingData",
                type: "float",
                nullable: true);
        }
    }
}
