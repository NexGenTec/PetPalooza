import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilGatoPage } from './perfil-gato.page';

describe('PerfilGatoPage', () => {
  let component: PerfilGatoPage;
  let fixture: ComponentFixture<PerfilGatoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilGatoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
