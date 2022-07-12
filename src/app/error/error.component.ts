import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  template: `<h3>Страница не найдена</h3>`,
  styles: [''],
})
export class ErrorComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
