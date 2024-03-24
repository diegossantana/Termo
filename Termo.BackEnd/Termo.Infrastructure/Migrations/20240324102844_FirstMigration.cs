using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Termo.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FirstMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DayWords",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Value = table.Column<string>(type: "TEXT", nullable: true),
                    Day = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Used = table.Column<bool>(type: "INTEGER", nullable: false),
                    Success = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DayWords", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DayWords");
        }
    }
}
