using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using System.Net.Http;

namespace Termo.BackEnd {
    public class TermoPersistence {
        private readonly HttpClient _httpClient;
        public static string WordDay { get; set; }

        public TermoPersistence() {
            _httpClient = new HttpClient();
        }
        public async Task<string> loadDatabase(WebApplicationBuilder builder) {
            TermoContext context = new TermoContext();
            int amountWords = context.DayWords.Count();

            await populationDatabase(context, amountWords);

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

        private async Task populationDatabase(TermoContext context, int amountWords) {
            if (amountWords < 365) {
                var response = await _httpClient.GetAsync("https://www.ime.usp.br/~pf/dicios/br-utf8.txt");
                //var response = await _httpClient.GetAsync("https://raw.githubusercontent.com/fserb/pt-br/master/palavras");
                var concatedWords = await response.Content.ReadAsStringAsync();
                var wordsSpliteds = concatedWords.Split("\n").Where(p => p.Length == 5).ToList();

                foreach (var item in wordsSpliteds) {
                    await context.DayWords.AddAsync(new DayWord {
                        Value = item,
                        Used = false,
                        Success = false,
                    });
                }
                await context.SaveChangesAsync();
            }
        }

        internal async Task wordDaySuccessAsync(bool success) {
            TermoContext context = new TermoContext();

            var wordDay = context.DayWords.Where(w => w.Value ==  WordDay).FirstOrDefaultAsync();

            wordDay.Result.Success = true;

            wordDay.Result.Used = true;

            context.DayWords.Update(wordDay.Result);

            context.SaveChanges();
        }
    }
}
