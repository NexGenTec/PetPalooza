import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatModalPage } from './cat-modal.page';

describe('CatModalPage', () => {
  let component: CatModalPage;
  let fixture: ComponentFixture<CatModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CatModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
