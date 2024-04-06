import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ImgModalPage } from '../img-modal/img-modal.page';
import * as infoPerro from '../../assets/data/InfoPerro.json';
import * as infoGato from '../../assets/data/InfoGato.json';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  infoGato: any = (infoGato as any).default;
  infoPerro: any = (infoPerro as any).default;
  infoPerroChunks: any[][] = [];
  infoGatoChunks: any[][] = [];


  constructor(private router: Router, private modalController: ModalController) {
    for (let i = 0; i < this.infoPerro.length; i += 3) {
      this.infoPerroChunks.push(this.infoPerro.slice(i, i + 3));
    }
    for (let i = 0; i < this.infoGato.length; i += 3) {
      this.infoGatoChunks.push(this.infoGato.slice(i, i + 3));
    }
  }

  navigateToTargetPage(segment: string, gatoId: number) {
    this.router.navigate(['/tabs/tab1', segment, gatoId]);
  }
  navigateToTargetPage2(segment: string, perroId: number) {
    this.router.navigate(['/tabs/tab3', segment, perroId]);
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
