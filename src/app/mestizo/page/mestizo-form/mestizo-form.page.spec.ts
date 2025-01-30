import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MestizoFormPage } from './mestizo-form.page';

describe('MestizoFormPage', () => {
  let component: MestizoFormPage;
  let fixture: ComponentFixture<MestizoFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MestizoFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
