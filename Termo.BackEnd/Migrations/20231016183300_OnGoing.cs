using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Termo.BackEnd.Migrations
{
    /// <inheritdoc />
    public partial class OnGoing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Success",
                table: "DayWords",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Used",
                table: "DayWords",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Success",
                table: "DayWords");

            migrationBuilder.DropColumn(
                name: "Used",
                table: "DayWords");
        }
    }
}
