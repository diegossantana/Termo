using Microsoft.EntityFrameworkCore;
using Termo.BackEnd;

var builder = WebApplication.CreateBuilder(args);
var externanHttpService = new ExternalHttpService();

builder.Services.AddDbContext<TermoContext>(context => context.UseSqlite(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapGet("/words", async (TermoContext context) => {
    var day = DateTime.Now.Date;
    var word = await context.DayWords.Where(w => w.Day == day).FirstOrDefaultAsync();

    if (word == null) {
        return Results.NotFound();
    }

    return Results.Ok(word.Value);
});

app.MapGet("/words/validations", async (TermoContext context, string word) => {
    if (word.Length != 5) {
        return Results.BadRequest("Não atende ao padrão de 5 letras.");
    }
    var words = await externanHttpService.GetWords();
    if (!words.Contains(word.ToLower())) {
        return Results.BadRequest("Palavra não  aceita neste jogo.");
    }

    var day = DateTime.Now.Date;
    var dayWord = await context.DayWords.Where(w => w.Day == day).FirstOrDefaultAsync();

    if (dayWord == null) {
        return Results.NotFound("Palavra não encontrada.");
    }

    return Results.Ok(ValidateWord(dayWord.Value, word));
});

//MÉTODO VERIFICA SE A LETRA EXISTE NA PALAVRA E SE A MESMA ESTÁ NA POSIÇÃO CERTA
static WordResult ValidateWord(string dayWord, string wordAttempt) {
    Letter[] letterResult = new Letter[dayWord.Length];

    for (int i = 0; i < wordAttempt.Length; i++) {
        var letterAttempt = wordAttempt[i];
        bool exists, rightPlace;

        exists = dayWord.Contains(letterAttempt);
        rightPlace = dayWord[i] == letterAttempt;

        letterResult[i] = new Letter(letterAttempt, exists, rightPlace);
    }

    return new WordResult(letterResult, dayWord == wordAttempt);
}

app.MapPost("/words", async (TermoContext context, string word) => {
    var day = DateTime.Now.Date;

    var wordDb = new DayWord() {
        Day = day,
        Value = word
    };

    await context.DayWords.AddAsync(wordDb);
    await context.SaveChangesAsync();
});

app.Run();

/**
 * ABAIXO, SEGUE UM NOVO JEITO DO .NET 6 CRIAR CLASSES. A PALAVRA RESERVADA 'RECORD', É O MEIO UTILIZADA PELO .NET PARA REPRESENTA UMA CLASSE.
 */
internal record Letter(char Value, bool Exists, bool RightPlace);
internal record WordResult(Letter[] Letters, bool Success);