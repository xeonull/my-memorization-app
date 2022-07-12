import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';

export interface Dictionary {
  word: string;
  trans: string;
}

export interface Settings {
  langNative: string;
  langLearn: string;
  wordsCount: number;
}

@Injectable({ providedIn: 'root' })
export class DictionaryService {
  private dictionary: Dictionary[];
  private settings: Settings;

  constructor(private storage: LocalStorageService) {
    this.settings = this.settingsRetrieve();
    if (!this.settings)
      this.settings = {
        langNative: 'ru',
        langLearn: 'en',
        wordsCount: 4,
      };
    this.dictionary = this.dictionaryRetrieve();
    if (!this.dictionary) this.dictionary = [];
  }

  get Words(): Dictionary[] {
    return this.dictionary;
  }

  addWords(words: Dictionary[]): void {
    if (!!words) this.dictionary.push(...words);
    this.dictionaryStore();
  }

  RemoveDuplicates(words: string[]): string[] {
    return words.filter(
      (w) => this.dictionary.find((word) => word.word == w) === undefined
    );
  }

  get Settings(): Settings {
    return this.settings;
  }

  changeSettings(
    nativeLang: string,
    learnLang: string,
    wordsCount: number
  ): void {
    if (
      this.settings.langNative !== nativeLang ||
      this.settings.langLearn !== learnLang ||
      this.settings.wordsCount !== wordsCount
    ) {
      this.settings.langNative = nativeLang;
      this.settings.langLearn = learnLang;
      this.settings.wordsCount = wordsCount;
      this.dictionary = this.dictionaryRetrieve();
      if (!this.dictionary) this.dictionary = [];
      this.settingsStore();
      this.dictionaryStore();
    }
  }

  private dictionaryRetrieve(): Dictionary[] {
    return this.storage.retrieve(
      `my-app-dictionary[${this.settings.langNative}_${this.settings.langLearn}]`
    );
  }

  private dictionaryStore(): void {
    this.storage.store(
      `my-app-dictionary[${this.settings.langNative}_${this.settings.langLearn}]`,
      this.dictionary
    );
  }

  private settingsRetrieve(): Settings {
    return this.storage.retrieve(`my-app-settings`);
  }

  private settingsStore(): void {
    this.storage.store(`my-app-settings`, this.settings);
  }
}
