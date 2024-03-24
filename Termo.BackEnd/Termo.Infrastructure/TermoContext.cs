using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Termo.Domain;

namespace Termo.Infrastructure {
    public class TermoContext : DbContext {
        public DbSet<DayWord> DayWords { get; set; }
        public TermoContext(DbContextOptions options) : base(options) {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
            optionsBuilder.UseSqlite("Data Source=TermoDb.db");
        }

    }
}
