﻿using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using Microsoft.EntityFrameworkCore.Update.Internal;
using Microsoft.Extensions.Configuration;
using System.Linq;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Termo.BackEnd {
    public class ExternalHttpService {
        private readonly HttpClient _httpClient;
        public ExternalHttpService(WebApplicationBuilder builder) {
            _httpClient = new HttpClient();

            loadDatabase(builder);
        }

        private async void loadDatabase(WebApplicationBuilder builder) {
            TermoContext context = new TermoContext();
            int amountWords = context.DayWords.Count();

            if (amountWords < 365) {
                var response = await _httpClient.GetAsync("https://raw.githubusercontent.com/fserb/pt-br/master/palavras");
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
            } else {
                int v = new Random().Next(0, amountWords);

                SqliteConnectionStringBuilder connectionStringBuilder = new SqliteConnectionStringBuilder();

                connectionStringBuilder.DataSource = "TermoDb.db";

                using (SqliteConnection connection = new SqliteConnection(connectionStringBuilder.ConnectionString)) {
                    connection.Open();
                    string sql = "SELECT * from DayWords dw";

                    var insertCmd = connection.CreateCommand();

                    insertCmd.CommandText = sql;

                    SqliteDataReader sqliteDataReader = insertCmd.ExecuteReader();

                    int count = 0;
                    while (sqliteDataReader.Read()) {
                        if (count == v) {
                            string? v2 = sqliteDataReader["Value"].ToString();
                            continue;
                        }
                        count ++;
                    }

                    connection.Close();
                }
            }

        }


        public async Task<List<string>> GetWords() {
            //VAI AO REPOSITÓRIO
            var response = await _httpClient.GetAsync("https://raw.githubusercontent.com/fserb/pt-br/master/palavras");

            //RECEBE O CONTEÚDO NA VARIÁVEL CONCATEDWORDS
            var concatedWords = await response.Content.ReadAsStringAsync();

            //NORMALIZA A INFORMAÇÃO RECEBIDA
            var words = concatedWords.Split("\n").Where(p => p.Length == 5).ToList();

            return words;
        }
    }
}
