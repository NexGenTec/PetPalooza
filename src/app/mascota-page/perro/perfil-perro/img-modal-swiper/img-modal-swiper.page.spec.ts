import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImgModalSwiperPage } from './img-modal-swiper.page';

describe('ImgModalSwiperPage', () => {
  let component: ImgModalSwiperPage;
  let fixture: ComponentFixture<ImgModalSwiperPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgModalSwiperPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
