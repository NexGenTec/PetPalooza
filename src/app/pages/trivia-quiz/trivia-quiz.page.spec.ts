import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TriviaQuizPage } from './trivia-quiz.page';

describe('TriviaQuizPage', () => {
  let component: TriviaQuizPage;
  let fixture: ComponentFixture<TriviaQuizPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TriviaQuizPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
