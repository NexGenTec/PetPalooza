import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoedoresPage } from './roedores.page';

describe('RoedoresPage', () => {
  let component: RoedoresPage;
  let fixture: ComponentFixture<RoedoresPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RoedoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
