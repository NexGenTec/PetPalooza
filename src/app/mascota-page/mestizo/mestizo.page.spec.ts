import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MestizoPage } from './mestizo.page';

describe('MestizoPage', () => {
  let component: MestizoPage;
  let fixture: ComponentFixture<MestizoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MestizoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
