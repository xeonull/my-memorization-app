import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import { DictionaryService } from '../dictionary.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  Languages: any[] = [
    { code: 'ru', title: 'Русский' },
    { code: 'en', title: 'Английский' },
    { code: 'es', title: 'Испанский' },
    { code: 'de', title: 'Немецкий' },
  ];

  settingsForm: FormGroup;

  constructor(private dictionaryServive: DictionaryService) {
    const settings = this.dictionaryServive.Settings;

    this.settingsForm = new FormGroup(
      {
        NativeLanguage: new FormControl(settings.langNative),
        LearnLanguage: new FormControl(settings.langLearn),
        WordsCount: new FormControl(settings.wordsCount),
      },
      { validators: this.LanguageValidator }
    );
  }

  ngOnInit(): void {}

  onSave(): void {
    if (!this.settingsForm.errors) {
      this.dictionaryServive.changeSettings(
        this.settingsForm.controls['NativeLanguage'].value,
        this.settingsForm.controls['LearnLanguage'].value,
        this.settingsForm.controls['WordsCount'].value
      );
    }
  }

  private LanguageValidator(
    formControl: AbstractControl
  ): ValidationErrors | null {
    const native = formControl.get('NativeLanguage');
    const learn = formControl.get('LearnLanguage');
    return native && learn && native.value === learn.value
      ? {
          LanguageValidator: {
            message: 'Изучаемый язык должен отличаться от языка пользователя',
          },
        }
      : null;
  }
}
