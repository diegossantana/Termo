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

  onClick(event: Event) {
    if (!this.success) {
      var div = event.target as HTMLElement;

      if (
        div.parentElement?.getAttribute('row') == this.currentRow.toString()
      ) {
        div.parentElement?.querySelector('.edit')?.classList.remove('edit');
        div?.classList.add('edit');
      }
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    if (!this.success) {
      var key = event.key;

      if (/[a-zA-Z]/.test(key) && key.length == 1) {
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
