using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using Microsoft.EntityFrameworkCore.Update.Internal;
using Microsoft.Extensions.Configuration;
using System.Linq;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Termo.BackEnd {
    public class ExternalHttpService {
        private readonly HttpClient _httpClient;
        public ExternalHttpService() {
            _httpClient = new HttpClient();
        }

        public async Task<List<string>> GetWords() {
            //VAI AO REPOSITÓRIO
            var response = await _httpClient.GetAsync("https://www.ime.usp.br/~pf/dicios/br-utf8.txt");
            //var response = await _httpClient.GetAsync("https://raw.githubusercontent.com/fserb/pt-br/master/palavras");

            //RECEBE O CONTEÚDO NA VARIÁVEL CONCATEDWORDS
            var concatedWords = await response.Content.ReadAsStringAsync();

            //NORMALIZA A INFORMAÇÃO RECEBIDA
            var words = concatedWords.Split("\n").Where(p => p.Length == 5).ToList();

            return words;
        }
    }
}
