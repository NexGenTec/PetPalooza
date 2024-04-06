import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImgModalPage } from './img-modal.page';

describe('ImgModalPage', () => {
  let component: ImgModalPage;
  let fixture: ComponentFixture<ImgModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
