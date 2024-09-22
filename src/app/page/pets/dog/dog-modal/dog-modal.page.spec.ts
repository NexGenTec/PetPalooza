import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DogModalPage } from './dog-modal.page';

describe('DogModalPage', () => {
  let component: DogModalPage;
  let fixture: ComponentFixture<DogModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DogModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
