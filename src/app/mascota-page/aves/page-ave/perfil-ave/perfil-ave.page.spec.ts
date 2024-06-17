import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilAvePage } from './perfil-ave.page';

describe('PerfilAvePage', () => {
  let component: PerfilAvePage;
  let fixture: ComponentFixture<PerfilAvePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilAvePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
