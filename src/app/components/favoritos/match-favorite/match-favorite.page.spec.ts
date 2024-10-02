import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchFavoritePage } from './match-favorite.page';

describe('MatchFavoritePage', () => {
  let component: MatchFavoritePage;
  let fixture: ComponentFixture<MatchFavoritePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchFavoritePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
