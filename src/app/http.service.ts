import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class HttpService {
  constructor(private http: HttpClient) {}

  getTranslateMyMemory(
    word: string,
    lanuageFrom: string,
    languageTo: string
  ): Observable<string> {
    return this.http
      .get(
        `https://api.mymemory.translated.net/get?q=${word}!&langpair=${lanuageFrom}|${languageTo}`
      )
      .pipe(
        map((data: any) => {
          let res = data['responseData'];
          console.log('res:', res);
          return res.translatedText;
        }),
        catchError((err) => {
          console.log('[getTranslateMyMemory Error]:', err);
          throw Error(`(${err.status}) Ошибка: ${err.message}`);
        })
      );
  }

  getTranslateGoogle(
    word: string,
    lanuageFrom: string,
    languageTo: string
  ): Observable<string> {
    return this.http
      .get(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${lanuageFrom}&tl=${languageTo}&dt=t&q=${encodeURI(
          word
        )}`
      )
      .pipe(
        map((data: any) => {
          //console.log('data:', data)
          const res: string = data[0]?.reduce(
            (a: string, v: string[]) => `${a} ${v[0].trim()}`,
            ''
          );
          console.log('res:', res);
          return res;
        }),
        catchError((err) => {
          console.log('[getTranslateGoogle Error]:', err);
          throw Error(`(${err.status}) Ошибка: ${err.message}`);
        })
      );
  }
}
