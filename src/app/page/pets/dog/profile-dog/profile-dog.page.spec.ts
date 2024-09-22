import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileDogPage } from './profile-dog.page';

describe('ProfileDogPage', () => {
  let component: ProfileDogPage;
  let fixture: ComponentFixture<ProfileDogPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileDogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
