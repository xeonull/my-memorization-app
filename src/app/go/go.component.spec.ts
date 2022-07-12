import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LocalStorageService } from 'ngx-webstorage';
import { GoComponent } from './go.component';
import { DictionaryService, Dictionary, Settings } from '../dictionary.service';

describe('GoComponent', () => {
  let component: GoComponent;
  let fixture: ComponentFixture<GoComponent>;
  let dictionaryServive: DictionaryService;

  class MockLocalStorageService {
    settings: Settings = {
      langNative: 'ru',
      langLearn: 'en',
      wordsCount: 3,
    };
    dictionary_ru_en: Dictionary[] = [{ word: 'world', trans: 'мир' }];
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
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GoComponent],
      providers: [
        DictionaryService,
        { provide: LocalStorageService, useClass: MockLocalStorageService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoComponent);
    component = fixture.componentInstance;
    dictionaryServive = fixture.debugElement.injector.get(DictionaryService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`button 'Start' should exists on initial screen`, () => {
    let button = fixture.debugElement.query(By.css('.btn-start'));
    expect(button).toBeTruthy();
  });

  it(`button 'Start' should be missing after pressing key`, () => {
    component.startHandler();
    fixture.detectChanges();
    let button = fixture.debugElement.query(By.css('.btn-start'));
    expect(button).toBeFalsy();
  });

  it(`input element should be missing on initial screen`, () => {
    let input = fixture.debugElement.query(By.css('input'));
    expect(input).toBeFalsy();
  });

  it(`input element and 2 buttons should appear when the button 'Start' is pressed`, () => {
    let button = fixture.debugElement.query(By.css('.btn-start'));
    button.nativeElement.click();
    fixture.detectChanges();
    let input = fixture.debugElement.query(By.css('input'));
    let buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(input).withContext('should be Input element').toBeTruthy();
    expect(buttons.length).withContext('should be two Buttons').toBe(2);
  });

  it(`p message should show 'Верно!' when the input word is correct`, () => {
    let button = fixture.debugElement.query(By.css('.btn-start'));
    button.nativeElement.click();
    fixture.detectChanges();
    let input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'мир';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    let p = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(p.innerHTML).toEqual('Верно!');
  });

  it(`results should be shown after all answers`, () => {
    let button = fixture.debugElement.query(By.css('.btn-start'));
    button.nativeElement.click();
    fixture.detectChanges();
    component.nextHandler();
    component.nextHandler();
    component.nextHandler();
    fixture.detectChanges();
    let h4 = fixture.debugElement.query(By.css('h4'));
    expect(h4).toBeTruthy();
    expect(h4.nativeElement.innerHTML).toContain('Верных ответов:');
  });

  it(`next button should have text 'Готово' on the last question`, () => {
    let button = fixture.debugElement.query(By.css('.btn-start'));
    button.nativeElement.click();
    fixture.detectChanges();
    component.nextHandler();
    component.nextHandler();
    fixture.detectChanges();
    let buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons[1].nativeElement.innerHTML).toContain('Готово');
  });
});
