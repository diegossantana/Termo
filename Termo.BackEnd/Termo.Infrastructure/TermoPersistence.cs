using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Termo.Domain;

namespace Termo.Infrastructure {
    public class TermoPersistence {
        private readonly HttpClient _httpClient;
        private readonly TermoContext _context;

        public static TermoPersistence termoPersistence;

        public static string WordDay { get; set; }

        public TermoPersistence() {
            _httpClient = new HttpClient();
            _context = new TermoContext(new DbContextOptions<TermoContext>());
        }

        public async Task<string> loadDatabase() {
            int amountWords = _context.DayWords.Count();

            await populationDatabase(amountWords);

            WordDay = gettingWordDay(amountWords);

            return WordDay;
        }

        private static string gettingWordDay(int amountWords) {
            int v = new Random().Next(0, amountWords);

            SqliteConnectionStringBuilder connectionStringBuilder = new SqliteConnectionStringBuilder();

            connectionStringBuilder.DataSource = "TermoDb.db";

            string wordDay = string.Empty;
            using (SqliteConnection connection = new SqliteConnection(connectionStringBuilder.ConnectionString)) {
                connection.Open();
                string sql = "SELECT * from DayWords dw";

                var insertCmd = connection.CreateCommand();

                insertCmd.CommandText = sql;

                SqliteDataReader sqliteDataReader = insertCmd.ExecuteReader();

                int count = 0;
                while (sqliteDataReader.Read()) {
                    if (count == v) {
                        string? wordRandon = sqliteDataReader["Value"].ToString();
                        wordDay = wordRandon;
                        break;
                    }
                    count++;
                }
                connection.Close();
            }

            return wordDay;
        }

        private async Task populationDatabase(int amountWords) {
            if (amountWords < 365) {
                var response = await _httpClient.GetAsync("https://www.ime.usp.br/~pf/dicios/br-utf8.txt");
                //var response = await _httpClient.GetAsync("https://raw.githubusercontent.com/fserb/pt-br/master/palavras");
                var concatedWords = await response.Content.ReadAsStringAsync();
                var wordsSpliteds = concatedWords.Split("\n").Where(p => p.Length == 5).ToList();

                foreach (var item in wordsSpliteds) {
                    await _context.DayWords.AddAsync(new DayWord {
                        Value = item,
                        Used = false,
                        Success = false,
                    });
                }
                await _context.SaveChangesAsync();
            }
        }

        public async Task wordDaySuccessAsync(bool success) {

            var wordDay = _context.DayWords.Where(w => w.Value == WordDay).FirstOrDefaultAsync();

            wordDay.Result.Success = true;

            wordDay.Result.Used = true;

            _context.DayWords.Update(wordDay.Result);

            _context.SaveChanges();
        }

        public async Task AddWords(string word) {
            var day = DateTime.Now.Date;

            var wordDb = new DayWord() {
                Day = day,
                Value = word
            };

            await _context.DayWords.AddAsync(wordDb);
            await _context.SaveChangesAsync();
        }
    }
}
