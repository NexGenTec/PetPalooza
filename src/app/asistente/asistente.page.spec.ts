import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsistentePage } from './asistente.page';

describe('AsistentePage', () => {
  let component: AsistentePage;
  let fixture: ComponentFixture<AsistentePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AsistentePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
