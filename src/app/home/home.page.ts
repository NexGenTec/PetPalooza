import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ImgModalPage } from '../img-modal/img-modal.page';
import * as infoPerro from '../../assets/data/InfoPerro.json';
import { SearchModalPage } from '../search-modal/search-modal.page';
import * as infoGato from '../../assets/data/InfoGato.json';
import { Storage } from '@ionic/storage';
import { WelcomeModalPage } from '../welcome-modal/welcome-modal.page';

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
  showImage: boolean;


  constructor(private router: Router, private modalController: ModalController,
    private storage: Storage
  ) {
    for (let i = 0; i < this.infoPerro.length; i += 1) {
      this.infoPerroChunks.push(this.infoPerro.slice(i, i + 1));
    }
    for (let i = 0; i < this.infoGato.length; i += 1) {
      this.infoGatoChunks.push(this.infoGato.slice(i, i + 1));
    }
    this.combineAnimals();
    this.showImage = false;
    this.initStorage();
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
  async initStorage() {
    await this.storage.create(); // Crea la instancia de almacenamiento
    const isFirstTime = await this.storage.get('isFirstTime');
    if (!isFirstTime) {
      console.log('Es la primera vez que se inicia la aplicación');
      await this.storage.set('isFirstTime', true);
      this.presentWelcomeModal();
      this.showImage = true;
    } else {
      console.log('La aplicación ya se ha iniciado antes');
      this.showImage = false;
    }
  }

  async presentWelcomeModal() {
    const modal = await this.modalController.create({
      component: WelcomeModalPage,
      backdropDismiss: false
    });
    return await modal.present();
  }

}
