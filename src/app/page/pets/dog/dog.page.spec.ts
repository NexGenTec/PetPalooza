import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DogPage } from './dog.page';

describe('DogPage', () => {
  let component: DogPage;
  let fixture: ComponentFixture<DogPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
