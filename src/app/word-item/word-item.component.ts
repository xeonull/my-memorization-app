import { Component, Input, OnInit } from '@angular/core';
import { Dictionary } from '../dictionary.service';

@Component({
  selector: 'app-word-item',
  templateUrl: './word-item.component.html',
  styleUrls: ['./word-item.component.css'],
})
export class WordItemComponent implements OnInit {

  @Input()
  public word!: Dictionary;

  constructor() { }

  ngOnInit(): void {
  }

}
