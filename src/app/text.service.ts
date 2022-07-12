import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TextService {
  constructor() {}

  Parse(input_text: string, lang_code: string): string[] {
    //Удаляем все лишние символы в зависимости от выбранного языка
    switch (lang_code) {
      case 'ru': 
      input_text = input_text.replace(/[^\-а-яё\s]/gi, '')
        break;
      case 'en':
        input_text = input_text.replace(/[^\-'a-z\s]/gi, '')
        break;
      case 'es':
        input_text = input_text.replace(/[^\-'ñóáíúé¡¿a-z\s]/gi, '')
        break;
      case 'de':
        input_text = input_text.replace(/[^\-'äöüßa-z\s]/gi, '')
        break;
      default:
        throw Error(`Код языка не найден: ${lang_code}`)
    }
    input_text = input_text.trim().toLowerCase();

    //Удаляем повторяющиеся слова
    const words: string[] = Object.keys(
      input_text.split(' ').reduce((a, v) => ({ ...a, [v]: true }), {})
    );

    //Возвращаем массив строк
    return words;
  }
}
