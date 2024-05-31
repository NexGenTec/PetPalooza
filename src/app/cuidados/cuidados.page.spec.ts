import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CuidadosPage } from './cuidados.page';

describe('CuidadosPage', () => {
  let component: CuidadosPage;
  let fixture: ComponentFixture<CuidadosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CuidadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
