import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FoundationsPage } from './foundations.page';

describe('FoundationsPage', () => {
  let component: FoundationsPage;
  let fixture: ComponentFixture<FoundationsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FoundationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
