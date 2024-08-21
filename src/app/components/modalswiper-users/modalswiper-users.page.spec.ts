import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalswiperUsersPage } from './modalswiper-users.page';

describe('ModalswiperUsersPage', () => {
  let component: ModalswiperUsersPage;
  let fixture: ComponentFixture<ModalswiperUsersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalswiperUsersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
