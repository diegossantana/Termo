import { WordService } from './word.service';
import { Component, HostListener } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NotifierService } from 'angular-notifier';
import { WordValidations } from './models/WordValidations';

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
  providers: [WordService],
})
export class AppComponent {
  title = 'Termo.FrontEnd';
  currentRow = 0;
  success = false;

  constructor(private service: WordService, private notifierService: NotifierService) { }

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

  onKeyClick(event: Event) {
    if (!this.success) {
      var div = event.target as HTMLElement;
      var letter = div.getAttribute('keyboard-key') ?? '';

      if (/[a-zA-Z]/.test(letter) && letter.length == 1) {
        this.setCurrentPositionValue(letter);
        this.moveRight();
      } else if (letter == Key.ArrowRight) {
        this.moveRight();
      } else if (letter == Key.ArrowLeft) {
        this.moveLeft();
      } else if (letter == Key.Backspace) {
        if (document.querySelector('.edit')?.innerHTML == '') {
          this.moveLeft();
        }
        this.setCurrentPositionValue();
      } else if (letter == Key.Enter) {
        this.sendWord();
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
      /* ESTA CONDIÇÃO FILTRA O CARACTERE INSERIDO, PEGADO APENAS AS LETRAS E O SEU TAMANHO */
      /* Filtro através de regex, para capturar apenas letras
        O length, faz com que o evento recebido, ou seja, a letra inserida pelo usuário não seja
        um backspace, space, ou qualquer outra tecla, além das letras.     A
      */
      if (/[a-zA-Z]/.test(key) && key.length == 1) {
        /* OS MÉTODO ABAIXO INSERE A INFORMAÇÃO NO LOCAL ATUAL*/
        /* Atendida a condição, preenche a posição atual através da função 'setCurrentPosition()', através da verificação da posição da classe '.edit' no documento.
           Depois move o cursor para a próxima posição,  através das funções 'moveRight()' e 'moveLeft()', junto com a classe '.edit' através das funções abaixo.
        */
        this.setCurrentPositionValue(key);
        /* O MÉTODO ABAIXO FAZ O MOVIMENTO AUTOMÁTICO PARA A PRÓXIMA POSIÇÃO DEPOIS QUE A LETRA É INSERIDA NA CAIXA SELECIONADA.*/
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
        this.sendWord();
      }
    }
  }

  /* O MÉTODO ABAIXO INSEREA INFORMAÇÃO NO LOCAL ATUAL*/
  setCurrentPositionValue(value: string = '') {
    document.querySelector('.edit')?.replaceChildren(value);
  }

  /* O MÉTODO ABAIXO FAZ O MOVIMENTO AUTOMÁTICO PARA A PRÓXIMA POSIÇÃO DEPOIS QUE A LETRA É INSERIDA NA CAIXA SELECIONADA.*/
  moveRight() {
    var index = Number(document.querySelector('.edit')?.getAttributeNode('pos'));

    if (index < 4) {
      document.querySelector('.edit')?.parentElement?.children.item(index + 1)?.classList.add('edit');
      document.querySelector('.edit')?.classList.remove('edit');
    }
  }

  /* O MÉTODO ABAIXO FAZ O MOVIMENTO AUTOMÁTICO PARA A POSIÇÃO ANTERIOR DEPOIS QUE A LETRA É INSERIDA OU REMOVIDA DA CAIXA SELECIONADA.*/
  moveLeft() {
    var index = Number(document.querySelector('.edit')?.getAttributeNode('pos'));

    if (index > 0) {
      document.querySelector('.edit')?.parentElement?.children.item(index - 1)?.classList.add('edit');
      document.querySelectorAll('.edit')[1].classList.remove('edit');
    }
  }

  sendWord() {
    var word = this.getWord();

    if (word.length < 5) {
      this.notifierService.notify('info', 'Só palavras com 5 letras.')
    } else {
      this.getValidations(word.toLocaleLowerCase());
    }
  }

  getWord() {
    var word = '';

    const row = document.querySelector(`[row ="${this.currentRow}"]`)

    if (row != undefined) {
      for (let index = 0; index < row?.children.length; index++) {
        const letter = row?.children.item(index)?.innerHTML;
        if (letter != undefined) {
          word = word + letter;
        }
      }
    }
    return word;
  }

  getValidations(word: string) {
    this.service.getValidations(word)
      .pipe(catchError((error: HttpErrorResponse) => {
        return throwError(() => null)
      }))
      .subscribe(p => {
        var validations = p;

        const row = document.querySelector(`[row="${this.currentRow}"]`);

        for (let index = 0; index < validations.letters.length; index++) {
          var validationLetter = validations.letters[index];

          if (validationLetter.exists) {
            if (validationLetter.rightPlace) {
              row?.querySelector(`[pos="${index}"]`)?.classList.add('right');
            } else {
              row?.querySelector(`[pos="${index}"]`)?.classList.add('place');
            }
          } else {
            row?.querySelector(`[pos="${index}"]`)?.classList.add('wrong');
          }
          setTimeout(() => {
            row?.querySelector(`[pos="${index}"]`)?.classList.remove('edit');
            row?.querySelector(`[pos="${index}"]`)?.classList.remove('active');
          }, 2000);
        }
        setTimeout(() => {
          if (validations.success) {
            this.success = true;
            this.notifierService.notify('info', 'Sucesso');
          } else {
            this.enableNextRow();
          }
          this.setKeyboardColors(validations)
        }, 1800);
      })
  }
  setKeyboardColors(validations: WordValidations) {
    for (let index = 0; index < validations.letters.length; index++) {
      const validationLetter = validations.letters[index];
      var element = document.querySelector(`[keyboard-key="${validationLetter.value.toUpperCase()}"]`);

      if (validationLetter.exists) {
        if (validationLetter.rightPlace) {
          element?.classList.remove('place');
          element?.classList.add('right');
        } else {
          element?.classList.add('place');
        }
      } else {
        element?.classList.add('keyboard-wrong');
      }
    }
  }

  enableNextRow() {
    this.currentRow++;

    const row = document.querySelector(`[row="{this.currentRow}"]`);
    if (row != undefined) {
      for (let index = 0; index < row?.children.length; index++) {
        const letter = row?.children.item(index);
        letter?.classList.add('active');
        if (index == 0) {
          letter?.classList.add('edit');
        }
      }
    }
  }



}
