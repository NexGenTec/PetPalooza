import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalMapsPage } from './modal-maps.page';

describe('ModalMapsPage', () => {
  let component: ModalMapsPage;
  let fixture: ComponentFixture<ModalMapsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMapsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
