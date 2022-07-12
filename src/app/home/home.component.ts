import { Component, OnInit } from '@angular/core';
import { Dictionary, Settings, DictionaryService } from '../dictionary.service';
import { HttpService } from '../http.service';
import { TextService } from '../text.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  newText: string = '';
  words: Dictionary[] = [];
  messageClass: string = 'm-hide';
  messageText: string = '';

  constructor(
    private dictionaryServive: DictionaryService,
    private httpService: HttpService,
    private textService: TextService
  ) {}

  addTextHandler(): void {
    try {
      let settings: Settings = this.dictionaryServive.Settings;
      let parse_words: string[] = this.textService.Parse(
        this.newText,
        settings.langLearn
      );
      parse_words = this.dictionaryServive.RemoveDuplicates(parse_words);
      console.log('parse_words:', parse_words);

      if (parse_words.length > 0) {        
        const separator: string = '; ';
        //console.log('parse_words:', parse_words);
        let text: string = parse_words.join(separator);
        if (text.length > 500) {
          throw Error('Длина текста должна быть не больше 500 символов');
        }
        console.log('text:', text);
        let dictionary: Dictionary[] = [];
        this.httpService
          .getTranslateGoogle(text, settings.langLearn, settings.langNative)
          .subscribe({
            next: (data: string) => {
              //console.log('[subscribe next]:', data);
              data.split(separator).map((e, i) => {
                //console.log('[e]:', e);
                e = e.trim();
                if (e !== '') {
                  //console.log('[word]:', words[i]);
                  //console.log('[trans]:', e.toLowerCase());
                  dictionary.push({
                    word: parse_words[i],
                    trans: e.toLowerCase(),
                  });
                  //console.log('[dictionary_next]:', dictionary);
                }
              });
            },
            error: (error) => {
              console.log('[subscribe error]:', error);
              this.showErrorMessage(error.message);
            },
            complete: () => {
              console.log('[subscribe complete]');
              this.dictionaryServive.addWords(dictionary);
              this.words = this.dictionaryServive.Words;
            },
          });
      }
    } catch (e) {
      let message;
      if (e instanceof Error) message = e.message;
      else message = String(e);
      this.showErrorMessage(message);
    }

    this.newText = '';
  }

  showErrorMessage(message: string): void {
    if (message.length > 124) message = `${message.substring(0, 120)} ...`;
    this.messageText = message;
    this.messageClass = 'm-show';
    setTimeout(() => {
      this.messageClass = 'm-hide';
    }, 8000);
  }

  keyEnterHandler(event: any): void {
    this.addTextHandler();
  }

  inputHandler(value: any): void {
    this.newText = value;
  }

  ngOnInit(): void {
    this.words = this.dictionaryServive.Words;
  }
}
