import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileCatPage } from './profile-cat.page';

describe('ProfileCatPage', () => {
  let component: ProfileCatPage;
  let fixture: ComponentFixture<ProfileCatPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
