import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ImgModalPage } from '../img-modal/img-modal.page';
import * as infoPerro from '../../assets/data/InfoPerro.json';
import { SearchModalPage } from '../search-modal/search-modal.page';

@Component({
  selector: 'app-perro',
  templateUrl: 'perro.page.html',
  styleUrls: ['perro.page.scss']
})
export class perroPage {
  infoPerro: any = (infoPerro as any).default;
  infoPerroChunks: any[][] = [];


  constructor(private router: Router, private modalController: ModalController) {
    for (let i = 0; i < this.infoPerro.length; i += 1) {
      this.infoPerroChunks.push(this.infoPerro.slice(i, i + 1));
    }
  }

  navigateToTargetPage(page: string, perroId: number) {
    this.router.navigate([page, perroId]);
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


  async openSearchModal() {
    const modal = await this.modalController.create({
      component: SearchModalPage,
      componentProps: {
        razas: this.infoPerro,
        tipo: 'perro'
      }
    });
    return await modal.present();
  }

}
