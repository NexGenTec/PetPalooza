import { Component, OnInit } from '@angular/core';
import { Mestizos } from './models/users.models';
import { MestizosService } from './service/mestizos.service';

@Component({
  selector: 'app-mestizos-list',
  templateUrl: './mestizos-list.page.html',
  styleUrls: ['./mestizos-list.page.scss'],
})
export class MestizosListPage implements OnInit {
  
  mestizos: Mestizos[] = [];
  filteredMestizos: Mestizos[] = [];
  searchTerm: string = '';
  isLoading = true;


  constructor(private mestizosService: MestizosService) {}

  ngOnInit(): void {
    this.loadMestizos();
  }

  loadMestizos(): void {
    this.mestizosService.getAllMestizos().subscribe({
      next: (mestizos: Mestizos[]) => {
        this.mestizos = mestizos;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading mestizos:', error);
        this.isLoading = false;
      },
    });
  }  
}
