import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ImgModalPage } from '../img-modal/img-modal.page';
import * as infoPerro from '../../assets/data/InfoPerro.json';
import * as infoGato from '../../assets/data/InfoGato.json';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class homePage {
  infoGato: any = (infoGato as any).default;
  infoPerro: any = (infoPerro as any).default;
  infoPerroChunks: any[][] = [];
  infoGatoChunks: any[][] = [];
  combinedAnimals: any[] = [];


  constructor(private router: Router, private modalController: ModalController) {
    for (let i = 0; i < this.infoPerro.length; i += 1) {
      this.infoPerroChunks.push(this.infoPerro.slice(i, i + 1));
    }
    for (let i = 0; i < this.infoGato.length; i += 1) {
      this.infoGatoChunks.push(this.infoGato.slice(i, i + 1));
    }
    this.combineAnimals();
  }

  navigateToTargetPage(segment: string, gatoId: number) {
    this.router.navigate([segment, gatoId]);
  }
  navigateToTargetPage2(segment: string, perroId: number) {
    this.router.navigate([segment, perroId]);
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

  combineAnimals() {
    const maxLength = Math.max(this.infoGato.length, this.infoPerro.length);
    for (let i = 0; i < maxLength; i++) {
      if (this.infoGato[i]) {
        this.combinedAnimals.push(this.infoGato[i]);
      }
      if (this.infoPerro[i]) {
        this.combinedAnimals.push(this.infoPerro[i]);
      }
    }
  }

}
