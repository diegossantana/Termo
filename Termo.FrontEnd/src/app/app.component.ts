import { WordService } from './word.service';
import { Component, HostListener } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NotifierService } from 'angular-notifier';
import { WordValidations } from './models/WordValidations';
import { Router } from '@angular/router';

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

  constructor(private service: WordService, private notifierService: NotifierService, private router: Router) { }

  onClickNewGame(event: Event) {
    this.service.getNewGame();
    location.reload();
  }
  onClickRefresh(event: Event) {
    location.reload();
  }

  onClick(event: Event) {
    if (!this.success) {
      var div = event.target as HTMLElement;
      if (div.parentElement?.getAttribute('row') == this.currentRow.toString()) {
        div.parentElement?.querySelector(".edit")?.classList.remove('edit');
        div?.classList.add('edit');
      }
    }
  }

  onKeyClick(event: Event) {
    if (!this.success) {
      var div = event.target as HTMLElement;
      var letter = div.getAttribute('keyboard-key') ?? '';

      if ((/[\u00C0-\u017F]/.test(letter) || /[a-zA-Z]/.test(letter)) && letter.length == 1) {
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

  @HostListener('window:keyup', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    if (!this.success) {
      var key = event.key;
      if ((/[\u00C0-\u017F]/.test(key) || /[a-zA-Z]/.test(key)) && key.length == 1) {
        this.setCurrentPositionValue(key);
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

  setCurrentPositionValue(value: string = '') {
    document.querySelector('.edit')?.replaceChildren(value);
  }

  moveRight() {
    var index = Number(document.querySelector('.edit')?.getAttribute('pos'));

    if (index < 4) {
      document.querySelector('.edit')?.parentElement?.children.item(index + 1)?.classList.add('edit');
      document.querySelector('.edit')?.classList.remove('edit');
    }
  }

  moveLeft() {
    var index = Number(document.querySelector('.edit')?.getAttribute('pos'));

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
      var index = Number(document.querySelector('.edit')?.getAttribute('pos'));

      if (index == 4) {
        document.querySelector('.edit')?.classList.remove('edit');
      }

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
        if (error.status == 400) {
          this.notifierService.notify('info', 'Palavra não aceita');
        }
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
            if (this.currentRow == 5) {
              this.notifierService.notify('error', 'Falhou')
            } else {
              this.enableNextRow();
            }
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

    const row = document.querySelector(`[row="${this.currentRow}"]`);
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
