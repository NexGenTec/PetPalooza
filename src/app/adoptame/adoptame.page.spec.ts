import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdoptamePage } from './adoptame.page';

describe('AdoptamePage', () => {
  let component: AdoptamePage;
  let fixture: ComponentFixture<AdoptamePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdoptamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
