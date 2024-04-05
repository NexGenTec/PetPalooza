import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilPerroPage } from './perfil-perro.page';

describe('PerfilPerroPage', () => {
  let component: PerfilPerroPage;
  let fixture: ComponentFixture<PerfilPerroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilPerroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
