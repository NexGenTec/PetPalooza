import { Component, OnInit } from '@angular/core';
import { Mestizos, Users } from '../../models/users.models';
import { MestizosService } from '../../service/mestizos.service';

@Component({
  selector: 'app-mestizo',
  templateUrl: './mestizo.page.html',
  styleUrls: ['./mestizo.page.scss'],
})
export class MestizoPage implements OnInit {
  user: Users;
  mestizos: Mestizos[] = [];
  loading: boolean = true;

  constructor(
    private mestizosService: MestizosService,
  ) {

   }

   ngOnInit() {
    const userSession = sessionStorage.getItem('user');
    if (userSession) {
      this.user = JSON.parse(userSession);
      this.loadMestizos();
    } else {
      this.loading = false;
    }
  }

  loadMestizos() {
    if (this.user?.id) {
      this.mestizosService.getMestizosByUserId(this.user.id).subscribe(
        (mestizos: Mestizos[]) => {
          this.mestizos = mestizos;
          this.loading = false; 
        },
        (error) => {
          console.error('Error al cargar las mascotas:', error);
          this.loading = false; 
        }
      );
    } else {
      this.loading = false; 
    }
  }
}
