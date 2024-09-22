import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalSwiperPage } from './modal-swiper.page';

describe('ModalSwiperPage', () => {
  let component: ModalSwiperPage;
  let fixture: ComponentFixture<ModalSwiperPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSwiperPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
