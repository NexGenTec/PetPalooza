import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TriviaBreedPage } from './trivia-breed.page';

describe('TriviaBreedPage', () => {
  let component: TriviaBreedPage;
  let fixture: ComponentFixture<TriviaBreedPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TriviaBreedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
