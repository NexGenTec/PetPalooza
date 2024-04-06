import { Component } from '@angular/core';
import { Router } from '@angular/router'
import { ModalController } from '@ionic/angular';
import { ImgModalPage } from '../img-modal/img-modal.page';
import * as infoGato from '../../assets/data/InfoGato.json';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  infoGato: any = (infoGato as any).default;
  infoGatoChunks: any[][] = [];


  constructor(private router: Router, private modalController: ModalController) {
    for (let i = 0; i < this.infoGato.length; i += 3) {
      this.infoGatoChunks.push(this.infoGato.slice(i, i + 3));
    }
  }

  navigateToTargetPage(page: string, gatoId: number) {
    this.router.navigate(['/tabs/tab1', page, gatoId]);
  }

  async openModal(imageUrl: string) {
    const modal = await this.modalController.create({
      component: ImgModalPage,
      componentProps: {
        imageUrl: imageUrl
      }
    });
    return await modal.present();
  }

  swiperOptions = {
    slidesPerView: 3,
    spaceBetween: 10,
    navigation: true
  };

}
