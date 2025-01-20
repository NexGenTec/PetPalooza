import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { MestizoFormPage } from './mestizo-form/mestizo-form.page';
import { Users } from './models/users.models';

@Component({
  selector: 'app-mestizo',
  templateUrl: './mestizo.page.html',
  styleUrls: ['./mestizo.page.scss'],
})
export class MestizoPage implements OnInit {
  user: Users;

  constructor(
    private router: Router,
    private modalController: ModalController
  ) {

   }

  ngOnInit() {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }

  getMascotaDataFromStorage() {
    const mascotaData = sessionStorage.getItem('mascotaData');
    if (mascotaData) {
      return JSON.parse(mascotaData);
    }
    return null;
  }  

  async openModal() {
    const modal = await this.modalController.create({
      component: MestizoFormPage,
    });
    return await modal.present();
  }

}
