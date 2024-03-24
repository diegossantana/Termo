using Microsoft.EntityFrameworkCore;
using Termo.Domain;
using Termo.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

string dayWord = string.Empty;

builder.Services.AddCors();

builder.Services.AddDbContext<TermoContext>(context => context.UseSqlite(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var externanHttpService = new ExternalHttpService();

TermoPersistence.termoPersistence = new TermoPersistence();
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(p =>
p.AllowAnyOrigin()
.AllowAnyHeader()
.AllowAnyMethod());

app.MapGet("/words", async () =>
{

    var day = DateTime.Now.Date;
    if (dayWord.Length < 1) {
        dayWord = TermoPersistence.termoPersistence.loadDatabase().Result;
    } 

    if (dayWord == null)
    {
        return Results.NotFound();
    }

    return Results.Ok(dayWord);
});

app.MapGet("/words/validations", async (string word) =>
{
    if (dayWord == string.Empty)
    {
        dayWord = TermoPersistence.termoPersistence.loadDatabase().Result;
    }

    if (word.Length != 5)
    {
        return Results.BadRequest("Não atende ao padrão de 5 letras.");
    }
    var words = await externanHttpService.GetWords();
    if (!words.Contains(word.ToLower()))
    {
        return Results.BadRequest("Palavra não  aceita neste jogo.");
    }

    WordResult wordResult = ValidateWord(dayWord, word);

    if (wordResult.Success)
    {
        TermoPersistence.termoPersistence.wordDaySuccessAsync(wordResult.Success);
        //await context.DayWords.Where(w => w.Value == dayWord).ExecuteUpdateAsync();
    }

    return Results.Ok(wordResult);
});

app.MapGet("/words/newgame", async () =>
{
    dayWord = TermoPersistence.termoPersistence.loadDatabase().Result;

    return Results.Ok(dayWord);
});

//MÉTODO VERIFICA SE A LETRA EXISTE NA PALAVRA E SE A MESMA ESTÁ NA POSIÇÃO CERTA
static WordResult ValidateWord(string dayWord, string wordAttempt)
{
    Letter[] letterResult = new Letter[dayWord.Length];

    for (int i = 0; i < wordAttempt.Length; i++)
    {
        var letterAttempt = wordAttempt[i];
        bool exists, rightPlace;

        exists = dayWord.Contains(letterAttempt);
        rightPlace = dayWord[i] == letterAttempt;

        letterResult[i] = new Letter(letterAttempt, exists, rightPlace);
    }

    return new WordResult(letterResult, dayWord == wordAttempt);
}

app.MapPost("/words", async (string word) => {
    await TermoPersistence.termoPersistence.AddWords(word);
});

app.Run();

/**
 * ABAIXO, SEGUE UM NOVO JEITO DO .NET 6 CRIAR CLASSES. A PALAVRA RESERVADA 'RECORD', É O MEIO UTILIZADA PELO .NET PARA REPRESENTA UMA CLASSE.
 */
internal record Letter(char Value, bool Exists, bool RightPlace);
internal record WordResult(Letter[] Letters, bool Success);
