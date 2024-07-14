import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FunFactsPage } from './fun-facts.page';

describe('FunFactsPage', () => {
  let component: FunFactsPage;
  let fixture: ComponentFixture<FunFactsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FunFactsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
