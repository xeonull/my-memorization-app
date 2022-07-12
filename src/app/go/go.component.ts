import { Component, OnInit } from '@angular/core';
import { DictionaryService, Dictionary, Settings } from '../dictionary.service';

@Component({
  selector: 'app-go',
  templateUrl: './go.component.html',
  styleUrls: ['./go.component.css'],
})
export class GoComponent implements OnInit {
  settings: Settings;
  word!: Dictionary;
  message: string;
  inputAnswer: string;
  arrayAnswer: boolean[];
  isRightAnswer: boolean;
  isNext: boolean;
  currentAnswer: number;
  isActive: boolean;
  rightAnswerCount: number;

  constructor(private dictionaryServive: DictionaryService) {
    this.message = '';
    this.inputAnswer = '';
    this.arrayAnswer = [];
    this.isRightAnswer = false;
    this.isNext = false;
    this.currentAnswer = 1;
    this.isActive = false;
    this.settings = this.dictionaryServive.Settings;
    this.rightAnswerCount = 0;
  }

  randomWord(): Dictionary {
    return this.dictionaryServive.Words[
      Math.floor(Math.random() * this.dictionaryServive.Words.length)
    ];
  }

  ngOnInit(): void {}

  inputHandler(value: any): void {
    this.inputAnswer = value;
    if (this.word && value === this.word.trans) {
      this.message = 'Верно!';
      this.isRightAnswer = true;
      this.isNext = true;
    } else {
      this.message = '';
    }
  }

  startHandler(): void {
    this.isActive = true;
    this.word = this.randomWord();
    this.arrayAnswer = [];
  }

  nextHandler(): void {
    this.message = '';
    this.arrayAnswer.push(this.isRightAnswer);
    this.isRightAnswer = false;
    this.isNext = false;
    this.inputAnswer = '';
    if (this.currentAnswer < this.settings.wordsCount) {
      this.word = this.randomWord();
      this.currentAnswer++;
    } else {
      this.currentAnswer = 1;
      this.isActive = false;
      this.rightAnswerCount = this.arrayAnswer.reduce((a, v) => a + +v, 0);
    }
  }

  dontknowHandler(): void {
    this.message = `Правильный ответ: ${this.word.trans}`;
    this.isNext = true;
  }
}
