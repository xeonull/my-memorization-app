import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';

import { HttpService } from './http.service';

describe('HttpService (with mocks)', () => {
  let httpTestingController: HttpTestingController;
  let translateService: HttpService;
  let text: string;
  let lanuageFrom: string;
  let languageTo: string;
  let urlGoogle: string;
  let urlMyMemory: string;
  let transaltedTextByGoogle: string;
  let transaltedTextByMyMemory: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpService],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    translateService = TestBed.inject(HttpService);
    text = 'one; two; five';
    lanuageFrom = 'en';
    languageTo = 'ru';
    urlGoogle = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${lanuageFrom}&tl=${languageTo}&dt=t&q=${encodeURI(
      text
    )}`;
    transaltedTextByGoogle = ' один; два; пять';
    urlMyMemory = `https://api.mymemory.translated.net/get?q=${text}!&langpair=${lanuageFrom}|${languageTo}`;
    transaltedTextByMyMemory = 'один; два; пять!';
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(translateService).toBeTruthy();
  });

  it('should return translated text by Google', () => {
    let expectedData: Array<any> = [
      [
        ['один; ', 'one;', null, null, 10],
        ['два; ', 'two;', null, null, 10],
        ['пять', 'five', null, null, 10],
      ],
      null,
      'en',
      null,
      null,
      null,
      null,
      [],
    ];

    translateService
      .getTranslateGoogle(text, lanuageFrom, languageTo)
      .subscribe({
        next: (req) =>
          expect(req)
            .withContext('should return expected translated text')
            .toEqual(transaltedTextByGoogle),
        error: fail,
      });

    const req = httpTestingController.expectOne(urlGoogle);
    expect(req.request.method).toEqual('GET');

    req.flush(expectedData);
  });

  it('should turn 404 into a user-friendly error', () => {
    const msg = '(404) Ошибка';
    translateService
      .getTranslateGoogle(text, lanuageFrom, languageTo)
      .subscribe({
        next: _ => fail('expected to fail'),
        error: (error) => expect(error.message).toContain(msg),
      });

    const req = httpTestingController.expectOne(urlGoogle);

    req.flush(msg, { status: 404, statusText: 'Not Found' });
  });

  it('should return translated text by MyMemory', () => {
    let expectedData: any = {
      responseData: {
        translatedText: 'один; два; пять!',
        match: 0.85,
      },
      quotaFinished: false,
      mtLangSupported: null,
      responseDetails: '',
      responseStatus: 200,
      responderId: '45',
      exception_code: null,
      matches: [
        {
          id: 0,
          segment: 'one; two; five!',
          translation: 'один; два; пять!',
          source: 'en-GB',
          target: 'ru-RU',
        },
      ],
    };
    translateService
      .getTranslateMyMemory(text, lanuageFrom, languageTo)
      .subscribe({
        next: (req) =>
          expect(req)
            .withContext('should return expected translated text')
            .toEqual(transaltedTextByMyMemory),
        error: fail,
      });

    const req = httpTestingController.expectOne(urlMyMemory);
    expect(req.request.method).toEqual('GET');

    req.flush(expectedData);
  });

  it('should turn 429 from MyMemory api', () => {
    const msg = '(429) Ошибка';
    translateService
      .getTranslateMyMemory(text, lanuageFrom, languageTo)
      .subscribe({
        next: _ => fail('expected to fail'),
        error: (error) => expect(error.message).toContain(msg),
      });

    const req = httpTestingController.expectOne(urlMyMemory);

    req.flush(msg, { status: 429, statusText: 'Too Many Requests' });
  });
});
