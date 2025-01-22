import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { MestizoFormPage } from '../mestizo-form/mestizo-form.page';
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

  constructor(
    private router: Router,
    private modalController: ModalController,
    private mestizosService: MestizosService,
  ) {

   }

  ngOnInit() {
    const userSession = sessionStorage.getItem('user');
    if (userSession) {
      this.user = JSON.parse(userSession);
      this.loadMestizos();
    }
  }

  loadMestizos() {
    if (this.user?.id) {
      this.mestizosService.getMestizosByUserId(this.user.id).subscribe(
        (mestizos: Mestizos[]) => {
          this.mestizos = mestizos;
          console.log('Mascotas cargadas:', this.mestizos);
        },
        (error) => {
          console.error('Error al cargar las mascotas:', error);
        }
      );
    }
  }

  // async openModal() {
  //   const modal = await this.modalController.create({
  //     component: MestizoFormPage,
  //   });
  //   modal.onDidDismiss().then(() => {
  //     this.loadMestizos();
  //   });
  //   return await modal.present();
  // }

}
