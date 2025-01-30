import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MestizosListPage } from './mestizos-list.page';

describe('MestizosListPage', () => {
  let component: MestizosListPage;
  let fixture: ComponentFixture<MestizosListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MestizosListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
