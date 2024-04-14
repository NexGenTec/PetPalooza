import { Component } from '@angular/core';
import { Router } from '@angular/router'
import { ModalController } from '@ionic/angular';
import { ImgModalPage } from '../img-modal/img-modal.page';
import * as infoGato from '../../assets/data/InfoGato.json';
import { SearchModalPage } from '../search-modal/search-modal.page';
@Component({
  selector: 'app-gato',
  templateUrl: 'gato.page.html',
  styleUrls: ['gato.page.scss']
})
export class gatoPage {
  infoGato: any = (infoGato as any).default;
  infoGatoChunks: any[][] = [];
  filteredInfoGatoChunks: any[][] = [];

  constructor(private router: Router, private modalController: ModalController) {
    for (let i = 0; i < this.infoGato.length; i += 1) {
      this.infoGatoChunks.push(this.infoGato.slice(i, i + 1));
    }
    this.filteredInfoGatoChunks = this.infoGatoChunks;
  }

  navigateToTargetPage(page: string, gatoId: number) {
    this.router.navigate([page, gatoId]);
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
        razas: this.infoGato,
        tipo: 'gato'
      }
    });
    return await modal.present();
  }
}
