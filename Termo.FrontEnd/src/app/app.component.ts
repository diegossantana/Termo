import { Component, HostListener } from '@angular/core';

export enum Key {
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
  Backspace = 'Backspace',
  Enter = 'Enter',
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Termo.FrontEnd';
  currentRow = 0;
  success = false;
/* A FUNÇÃO ONCLICK, QUE ESTÁ SENDO CHAMADA DO SCSS, FAZ COM QUE A CADA INTERAÇÃO DO JOGADOR COM O ELEMENTO, O MESMO REAJA SEGUNDO AS REGRAS DO JOGO.*/
  onClick(event: Event) {
    if (!this.success) {
      /* A LINHA ABAIXO, EVIDENCIA QUE O ELEMENTO SELECIONADO(TARGET) É DO TIPO HTML  */
      var div = event.target as HTMLElement;
      /* CONDIÇÃO VERIFICA SE O ELEMENTO TEM O ATRIBUTO ROW E SE A LINHA SELECIONADA TEM É A LINHA 0 */
      if (div.parentElement?.getAttribute('row') == this.currentRow.toString()) {
        /* PEGA ELEMENTO QUE FOI SELECIONADO(TARGET), VERIFICA SE TEM O EDIT, PARA NÃO ALTERAR AS DEMAIS LINHAS, DEPOIS REMOVE O EDIT E ADICIONA A OUTRO ITEM? */
        div.parentElement?.querySelector('.edit')?.classList.remove('edit');
        div?.classList.add('edit');
      }
    }
  }

  /* ANOTAÇÃO QUE FICA ESCUTANDO A INTERAÇÃO COM PROGRAMA
     NO CASO EM QUESTÃO, A INTERAÇÃO COM O TECLADO, MAIS ESPECIFICAMENTE, QUANDO A TECLA É SOLTA APÓS SER PRESSIONADA.
   */
  @HostListener('window:keyup', ['$event'])
  /* A classe KeyboardEvent captura todas a entradas do teclado no navegador. */
  onKeyPress(event: KeyboardEvent) {
    if (!this.success) {
      var key = event.key;
  /* Filtro através de regex, para capturar apenas letras
     O length, faz com que o evento recebido, ou seja, a letra inserida pelo usuário não seja
     um backspace, space, ou qualquer outra tecla, além das letras.     A
   */
      if (/[a-zA-Z]/.test(key) && key.length == 1) {
        /* Atendida a condição, preenche a posição atual através da função 'setCurrentPosition()', através da verificação da posição da classe '.edit' no documento.
           Depois move o cursor para a próxima posição,  através das funções 'moveRight()' e 'moveLeft()', junto com a classe '.edit' através das funções abaixo.
        */
        this.setCurrentPositionValue();
        this.moveRight();
      } else if (key == Key.ArrowRight) {
        this.moveRight();
      } else if (key == Key.ArrowLeft) {
        this.moveLeft();
      } else if (key == Key.Backspace) {
        if (document.querySelector('.edit')?.innerHTML == '') {
          this.moveLeft();
        }
        this.setCurrentPositionValue();
      } else if (key == Key.Enter) {
      }
    }
  }

  setCurrentPositionValue(value: string = '') {
    document.querySelector('.edit')?.replaceChildren(value);
  }

  moveRight() {
    var index = Number(
      document.querySelector('.edit')?.getAttributeNode('pos')
    );

    if (index < 4) {
      document
        .querySelector('.edit')
        ?.parentElement?.children.item(index + 1)
        ?.classList.add('edit');
      document.querySelector('.edit')?.classList.remove('edit');
    }
  }

  moveLeft() {
    var index = Number(
      document.querySelector('.edit')?.getAttributeNode('pos')
    );

    if (index > 0) {
      document
        .querySelector('.edit')
        ?.parentElement?.children.item(index - 1)
        ?.classList.add('edit');
      document.querySelectorAll('.edit')[1]?.classList.remove('edit');
    }
  }
}
