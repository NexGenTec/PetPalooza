import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilRoedorPage } from './perfil-roedor.page';

describe('PerfilRoedorPage', () => {
  let component: PerfilRoedorPage;
  let fixture: ComponentFixture<PerfilRoedorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilRoedorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
