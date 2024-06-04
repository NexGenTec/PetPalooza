import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReptilesPage } from './reptiles.page';

describe('ReptilesPage', () => {
  let component: ReptilesPage;
  let fixture: ComponentFixture<ReptilesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReptilesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
