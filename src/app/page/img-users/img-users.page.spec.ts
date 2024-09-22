import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImgUsersPage } from './img-users.page';

describe('ImgUsersPage', () => {
  let component: ImgUsersPage;
  let fixture: ComponentFixture<ImgUsersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgUsersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
