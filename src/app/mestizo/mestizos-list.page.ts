import { Component, OnInit } from '@angular/core';
import { MestizosService } from './service/mestizos.service';
import { Mestizos, Users } from './models/users.models';

@Component({
  selector: 'app-mestizos-list',
  templateUrl: './mestizos-list.page.html',
  styleUrls: ['./mestizos-list.page.scss'],
})
export class MestizosListPage implements OnInit {

  searchTerm: string = '';
  isLoading = true;
  usersWithMestizos: { user: Users, mestizos: Mestizos[] }[] = [];

  constructor(private mestizosService: MestizosService) {}

  ngOnInit() {
    this.loadMestizos();
  }
  loadMestizos(): void {
    this.mestizosService.getAllUsersWithMestizos().subscribe({
      next: (data) => {
        this.usersWithMestizos = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar los datos:', err);
        this.isLoading = false;
      }
    });
  }
}