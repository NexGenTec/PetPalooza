import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvesPage } from './aves.page';

describe('AvesPage', () => {
  let component: AvesPage;
  let fixture: ComponentFixture<AvesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AvesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
