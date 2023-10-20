using Microsoft.EntityFrameworkCore;

namespace Termo.BackEnd {
    public class TermoContext : DbContext {
        public DbSet<DayWord> DayWords { get; set; }

        public TermoContext() {
        }
        public TermoContext(DbContextOptions options) : base(options) {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
            IConfiguration configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", false, true)
                .Build();

            optionsBuilder.UseSqlite(configuration.GetConnectionString("Default"));
        }

    }
}
