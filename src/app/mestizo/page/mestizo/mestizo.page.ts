import { Component, OnInit } from '@angular/core';
import { Mestizos, Users } from '../../models/users.models';
import { MestizosService } from '../../service/mestizos.service';
import { UserSessionService } from '../../service/user-session.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

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
    private userService: UserSessionService,
    private router: Router,
    private loadingController: LoadingController
  ) {

   }

   ngOnInit() {
    this.userService.user$.subscribe((user) => {
      if (user) {
        this.user = user;
        this.loadMestizos();
      } else {
        this.loading = false;
      }
    });
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

  async redirectToPerfil(mestizoId: string) {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      spinner: 'bubbles',
      duration: 500,
      backdropDismiss: false,
    });

    await loading.present(); // Muestra el loading
    await loading.dismiss();
    this.router.navigate(['/perfil-mestizo', mestizoId]);
  }
}
