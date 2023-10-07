________________________________________________________________________ ANGULAR NG - #ERRO
	1 - A palavra reservada, NG, não funcionou por nada. A solução para a criação do pacote foi a utilização do código abaixo:
		npx -p @angular/cli ng new Termo.FrontEnd
	Fonte: https://stackoverflow.com/questions/54184357/npx-with-angular-cli-how-to-install-angular-cli-and-use-it-afterwards

	OBS 3:
		Com a dificuldade encontrada em utilizar a chave NG, mesmo após a instalação a mesma não se fará executável. Para executar a mesma se fez necessário a utilização do
		seguinte artifício:
			npm run ng serve -o

________________________________________________________________________ FUNÇÃO ONCLICK - REGRAS DO JOGO DEFINIDAS NA FUNÇÃO ONCLICK TERMO
  1 -  De acordo com que o jogo vai avançando, é necessário a mudança na linha que está sendo editada.
       Para tal, para que fique evidente a diferença entre as linhas, foi criada uma classe chamada '.edit', que toda vez que uma caixa é editada, a mesma percorre para a próxima
       ou para a anterior, caso seja acrescida ou desacrecida alguma letra.
       Por padrão, o '.edit', começa na primeira linha e no primeiro elemento dessa linha.
