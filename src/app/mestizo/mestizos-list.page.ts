import { Component, OnInit } from '@angular/core';
import { MestizosService } from './service/mestizos.service';
import { Mestizos, Users } from './models/users.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mestizos-list',
  templateUrl: './mestizos-list.page.html',
  styleUrls: ['./mestizos-list.page.scss'],
})
export class MestizosListPage implements OnInit {

  searchTerm: string = '';
  isLoading = true;
  usersWithMestizos: { user: Users, mestizos: Mestizos[] }[] = [];
  mestizos: Mestizos[] = [];

  constructor(
    private mestizosService: MestizosService,
    private router: Router) {}

  ngOnInit() {
    this.loadMestizos();
  }

  loadMestizos(): void {
    this.mestizosService.getAllUsersWithMestizos().subscribe({
      next: (data) => {
        this.mestizos = data; // Los datos ya están aplanados por la función getAllUsersWithMestizos()
        console.log('Datos cargados:', this.mestizos);
        this.isLoading = false; // Se detiene el indicador de carga
      },
      error: (err) => {
        console.error('Error al cargar los datos:', err); // Manejo de errores
        this.isLoading = false;
      }
    });
  }
  redirectToPerfil(mestizoId: string) {
    this.router.navigate([`/perfil-mestizo/${mestizoId}`]);
  }
}