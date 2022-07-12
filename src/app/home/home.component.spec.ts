import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { HomeComponent } from './home.component';
import { DictionaryService, Dictionary, Settings } from '../dictionary.service';
import { HttpService } from '../http.service';
import { WordItemComponent } from '../word-item/word-item.component';

class MockLocalStorageService {
  settings: Settings = {
    langNative: 'ru',
    langLearn: 'en',
    wordsCount: 4,
  };
  dictionary_ru_en: Dictionary[] = [
    { word: 'hello', trans: 'привет' },
    { word: 'world', trans: 'мир' },
  ];
  retrieve(key: string): Dictionary[] | Settings | {} {
    switch (key) {
      case `my-app-settings`:
        return this.settings;
      case `my-app-dictionary[ru_en]`:
        return this.dictionary_ru_en;
      default:
        return {};
    }
  }
  store(key: string, value: any): void {
    switch (key) {
      case `my-app-settings`:
        this.settings = value;
        break;
      case `my-app-dictionary[ru_en]`:
        this.dictionary_ru_en = value;
        break;
    }
  }
}

class MockHttpService {
  getTranslateGoogle(
    word: string,
    lanuageFrom: string,
    languageTo: string
  ): Observable<string> {
    return of(` один; два`);
  }
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent, WordItemComponent],
      providers: [
        DictionaryService,
        { provide: HttpService, useClass: MockHttpService },
        { provide: LocalStorageService, useClass: MockLocalStorageService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrive initial dictionary from store', () => {
    expect(component.words.length).toBe(2);
  });

  it('should add 2 words in dictionary by addTextHandler', () => {
    component.newText = 'one two';
    component.addTextHandler();
    expect(component.words.length).toBe(4);
  });

  it('should call addTextHandler when Button click', () => {
    spyOn(component, 'addTextHandler');
    fixture.debugElement.query(By.css('.btn-style')).nativeElement.click();
    expect(component.addTextHandler).toHaveBeenCalled();
  });

  it('should call addTextHandler when Enter key press in input text', () => {
    spyOn(component, 'addTextHandler');
    fixture.debugElement
      .query(By.css('.input-style'))
      .triggerEventHandler('keyup.enter', {});
    expect(component.addTextHandler).toHaveBeenCalled();
  });
});
