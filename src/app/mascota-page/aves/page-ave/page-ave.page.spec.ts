import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageAvePage } from './page-ave.page';

describe('PageAvePage', () => {
  let component: PageAvePage;
  let fixture: ComponentFixture<PageAvePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PageAvePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
