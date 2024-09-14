import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilMestizoPage } from './perfil-mestizo.page';

describe('PerfilMestizoPage', () => {
  let component: PerfilMestizoPage;
  let fixture: ComponentFixture<PerfilMestizoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilMestizoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
