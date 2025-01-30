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
  filteredMestizos: Mestizos[] = [];

  constructor(
    private mestizosService: MestizosService,
    private router: Router) {}

  ngOnInit() {
    this.loadMestizos();
  }

  loadMestizos(): void {
    this.mestizosService.getAllUsersWithMestizos().subscribe({
      next: (data) => {
        this.mestizos = data;
        this.filteredMestizos = this.mestizos;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar los datos:', err);
        this.isLoading = false;
      }
    });
  }

  filterMestizos(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredMestizos = this.mestizos;
    } else {
      this.filteredMestizos = this.mestizos.filter(mestizo =>
        mestizo.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        mestizo.apodo.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  redirectToPerfil(mestizoId: string) {
    this.router.navigate([`/perfil-mestizo/${mestizoId}`]);
  }
}