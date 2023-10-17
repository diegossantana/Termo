________________________________________________________________________ BANCO DE DADOS

1 - Para o gerenciamento das questãoes de banco de dados é necessário a instalação do pacote do 'MICROSOFT.ENTITYFRAMEWORKCORE' caso esteja utilizando o framework 'CORE' 
	e o 'MICROSOFT.ENTITYFRAMEWORK.TOOLS'.
	OBS 1:
		.TOOLS = Através deles são usados os comandos de add, atualização e exclusão de 'MIGRATIONS', ou seja, a criação e as implementações do banco de dados.
2 - Também é necessário a instalação do pacote do 'ENTITYFRAMEWORK' referente ao banco de dados que será utilizado, como por exemplo: 'MICROSOFT.ENTITYFRAMEWORK.SQLSERVER'.

________________________________________________________________________  DBCONTEXT

	1 - O termo 'base', utilizado no construtor da classe, significa dizer que está sendo passado para o construtor da classe atual 
		o modo de agir da classe referida dentro do parâmetro do construtor.
	2 - Para o funcionamento adequado da classe é necessário a realização da sobreescrita do método 'OnConfiguring', que é herdade da classe 'DbContext'.
		Nesse método é realizado o apontamento para o arquivo de configuração correto e através da classe passada no parêmtro do método, a saber 'DbContextOptionsBuilder',
		é realizada a definição de qual banco de dados irá se utilizar, seja ele 'Mysql', 'Oracle' ou 'Sqlite'.
	3 - As questões básica de criação do banco se encerram com a construção do mesmo na classe de inicialização, seja ela a 'program.cs' ou a 'startup.cs', como segue o exemplo:
		'builder.Services.AddDbContext<TermoContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("ServerConnection")));'
	
	OBS 2:
		As informações referentes a conexão do banco devem ser colocadas no arquivo de configuração(appsettings.json).

	4 - Realizada as configurações, o próximo passo é a adição(add-migration 'NomeDaMigrationInicial') e depois a criação do banco através do comando 'update-database'.

________________________________________________________________________ WEB API
	
	1 - Como característa essencial, as questãos dos verbos HTTP's(GET, PUT, POST, DELETE), já podem ser construídos nos seus respectivos locais. Como vemos na classe 'program.cs',
		os exemplos dos seguintes métodos e suas respectivas implementações: 'app.MapGet', 'app.MapPost'.
		Estes realizam consultas e registram informações no banco de dados, respectivamente.

________________________________________________________________________ EXTERNALHTTPSERVICE
	
	1 - Esta classe coleta, de um repositório, todas as palavras base do português. Para tal, se utiliza da classe 'HttpClient' e através do método 'GetAsync()', se conecta a repositório.
		Através do resultado(response), extrai as informações com o método 'ReadAsStringAsyn()'. Feito isso, basta definir a forma que será tratada o retorno.


________________________________________________________________________ GITHUB - PASTA INACESSÍVEL
	
	1 - Problema com pasta criada com o outro repositório. A solução para que a pasta volte a ficar acessível dentro do repositório do git hub é:
		A - Na pasta 'root' usar o seguinte comando : git rm --cached NomeDaPastaQueContémOOutroRepositório.
		B - Após a conclusão com exito do comando acima, deve-se excluir a pasta '.git' da pasta citada acima.
		C - Após a exclusão da pasta '.git', ainda no diretório raiz, executar o seguinte código: git add NomeDaPastaQueContinhaOOutroRepositório.
		D - Depois basta realizar o upload novamente, seja pelo visul studio, seja por linha ou IDE's do git.

________________________________________________________________________ EXTERNALHTTPSERVICE - loadDataBase()
	Esta função realizada a verificação se o banco de dados local tem palavras, caso não haja, faz a busca das informações e já a insere. 
	Caso tenha, apenas seleciona a palavra de início e retorna para o jogo iniciar.