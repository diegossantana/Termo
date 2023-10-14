________________________________________________________________________ ANGULAR NG - #ERRO
	1 - A palavra reservada, NG, não funcionou por nada. A solução para a criação do pacote foi a utilização do código abaixo:
		npx -p @angular/cli ng new Termo.FrontEnd
	Fonte: https://stackoverflow.com/questions/54184357/npx-with-angular-cli-how-to-install-angular-cli-and-use-it-afterwards

	OBS 1:
		Com a dificuldade encontrada em utilizar a chave NG, mesmo após a instalação a mesma não se fará executável. Para executar a mesma se fez necessário a utilização do
		seguinte artifício:
			npm run ng serve -o

________________________________________________________________________ FUNÇÃO ONCLICK - REGRAS DO JOGO DEFINIDAS NA FUNÇÃO ONCLICK TERMO
  1 -  De acordo com que o jogo vai avançando, é necessário a mudança na linha que está sendo editada.
       Para tal, para que fique evidente a diferença entre as linhas, foi criada uma classe chamada '.edit', que toda vez que uma caixa é editada, a mesma percorre para a próxima
       ou para a anterior, caso seja acrescida ou desacrecida alguma letra.
       Por padrão, o '.edit', começa na primeira linha e no primeiro elemento dessa linha.

  COMENTÁRIOS ONCLICK
          A FUNÇÃO ONCLICK, QUE ESTÁ SENDO CHAMADA DO SCSS, FAZ COM QUE A CADA INTERAÇÃO DO JOGADOR COM O ELEMENTO, O MESMO REAJA SEGUNDO AS REGRAS DO JOGO
          A LINHA ABAIXO, EVIDENCIA QUE O ELEMENTO SELECIONADO(TARGET) É DO TIPO HTML
          CONDIÇÃO VERIFICA SE O ELEMENTO TEM O ATRIBUTO ROW E SE A LINHA SELECIONADA TEM É A LINHA 0
          PEGA ELEMENTO QUE FOI SELECIONADO(TARGET), VERIFICA SE TEM O EDIT, PARA NÃO ALTERAR AS DEMAIS LINHAS, DEPOIS REMOVE O EDIT E ADICIONA A OUTRO ITEM?

________________________________________________________________________ FUNÇÃO onKeyPress
  COMENTÁRIOS onKeyPress
          ANOTAÇÃO QUE FICA ESCUTANDO A INTERAÇÃO COM PROGRAMA
          NO CASO EM QUESTÃO, A INTERAÇÃO COM O TECLADO, MAIS ESPECIFICAMENTE, QUANDO A TECLA É SOLTA APÓS SER PRESSIONADA.

          A classe KeyboardEvent captura todas a entradas do teclado no navegador.
          ESTA CONDIÇÃO FILTRA O CARACTERE INSERIDO, PEGADO APENAS AS LETRAS E O SEU TAMANHO
          Filtro através de regex, para capturar apenas letras
          O length, faz com que o evento recebido, ou seja, a letra inserida pelo usuário não seja
          um backspace, space, ou qualquer outra tecla, além das letras.

          OS MÉTODO ABAIXO INSERE A INFORMAÇÃO NO LOCAL ATUAL
          Atendida a condição, preenche a posição atual através da função 'setCurrentPosition()', através da verificação da posição da classe '.edit' no documento.
          Depois move o cursor para a próxima posição,  através das funções 'moveRight()' e 'moveLeft()', junto com a classe '.edit' através das funções abaixo.
          O MÉTODO ABAIXO FAZ O MOVIMENTO AUTOMÁTICO PARA A PRÓXIMA POSIÇÃO DEPOIS QUE A LETRA É INSERIDA NA CAIXA SELECIONADA.

________________________________________________________________________ FUNÇÃO setCurrentPosition
          O MÉTODO ABAIXO INSERE A INFORMAÇÃO NO LOCAL ATUAL

________________________________________________________________________ FUNÇÃO moveRight
          O MÉTODO ABAIXO FAZ O MOVIMENTO AUTOMÁTICO PARA A PRÓXIMA POSIÇÃO DEPOIS QUE A LETRA É INSERIDA NA CAIXA SELECIONADA.
          PRIMEIRO ELE PEGA A POSIÇÃO DA DIV ATUAL QUE VEM EM FORMA DE STRING, CONVERTE E ADICIONA A VARIÁVEL ITEM
          DEPOIS RETORNA A PRIMEIRA OCORRÊNCIA DA PALAVRA DA CLASSE '.edit', BUSCA O PRÓXIMO ELEMENTO E ADICIONA A CLASSE '.edit' AO SEU CSS.
          DEPOIS REMOVE A CLASSE '.edit' DO PRIMEIRO ELEMENTO ENCONTRADO.

________________________________________________________________________ FUNÇÃO moveLeft
          O MÉTODO ABAIXO FAZ O MOVIMENTO AUTOMÁTICO PARA A POSIÇÃO ANTERIOR DEPOIS QUE A LETRA É INSERIDA OU REMOVIDA DA CAIXA SELECIONADA.

          PRIMEIRO ELE PEGA A POSIÇÃO DA DIV ATUAL QUE VEM EM FORMA DE STRING, CONVERTE E ADICIONA A VARIÁVEL ITEM
          DEPOIS RETORNA A PRIMEIRA OCORRÊNCIA DA PALAVRA DA CLASSE '.edit', BUSCA O ELEMENTO ANTERIOR E ADICIONA A CLASSE '.edit' AO SEU CSS.
          DEPOIS REMOVE A CLASSE '.edit'  BUSCANDO TODOS OS ELEMENTOS E ADICIONA ANTERIOR DO SEU INDEX.

________________________________________________________________________ FUNÇÃO sendWord
          FUNÇÃO CHAMADA QUANDO O JOGADOR ENVIA A PALAVRA PARA A AVALIAÇÃO.
          CHAMA A FUNÇAO GETWORD, DOCUMENTADA NO PRESENTE DOCUMENTO.
          A MESMA REALIZA UMA AVALIAÇÃO PARA SABER SE A PALAVRA CONTÉM OS 5 ALGARIMOS E DEPOIS, CASO ATENDA A CONDIÇÃO, A ENVIA PARA A AVALIAÇÃO DO getValidations.

________________________________________________________________________ FUNÇÃO getWord
          A FUNÇÃO GETWORD, COLETA A INFORMAÇÃO DA LINHA A QUAL ESTÁ SENDO ENVIADA A TENTATIVA.
          FAZ A CONCATENAÇÃO DE TODAS A LETRAS E COM ISSO FORMA A PALAVRA QUE SERÁ ENVIADA PARA AVALIAÇÃO.

________________________________________________________________________ FUNÇÃO getValidations
          RECEBE A PALAVRA CONTATENADA ATRAVÉS DO MÉTODO getWord, E ENVIA A MESMA PARA O WordService.

          É CHAMANDO ATRAVÉS DA VARIÁVEL QUE FOI PASSADA E INSTANCIADA NO CONSTRUTOR DO 'component.ts' QUE ESTÁ SENDO UTILIZADO.
          E ASSIM CHAMADO O MÉTODO UTILIZADO.

          AO RETORNAR COM A INFORMAÇÃO DO BACKEND, ELE CHAMA AS FUNÇÕES DE CSS, QUE ATRAVÉS DO RETORNO, ALTERA AS CORES DA LINHA ONDE OUVE A TENTATIVA, DE ACORDO COM A AVALIAÇÃO REALIZADA, CASO TENHO SIDO ACERTIVO,
          OU PARCIALMENTE ACERTIVO, FALANDO SE A LETRA CONSTA, SE ESTA NO LUGAR CERTO OU NÃO E DO TECLADO CRIADO COM O setKeyboardColors. INCLUSIVE, HABILITA E MARCA A PRÓXIMA LINHA COMO ATIVA ATRAVÉS DO MÉTODO enableNextRow.

________________________________________________________________________ CLASSE WordService
          CRIADO COM O OBJETIVO DE SER A PONTE ENTRE O FRONT E O BACKEND.
          RECEBE O LINK DO NOSSO BACKEND E FAZ A CHAMADA DOS ENDPOINT LÁ CONTIDO.

          OBS 2: PARA A UTILIZAÇÃO DESSE COMPONETE, É NECESSÁRIA QUE A MESMA SEJA PASSADA PARA O CONSTRUTOR DO '....component.ts' O QUAL UTILIZARÁ O SERVIÇO. E DEVIDAMENTE FEITO O SEU IMPORT.

________________________________________________________________________ CLASSE WordService
          TRATA-SE DE UMA CLASSE MODELO, SEMELHANTE A CONTIDO NO BACKEND. UTILIZADA PARA FACILITAR A CRIAÇÃO DE MODELOS NAS TENTATIVAS.
