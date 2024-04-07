import { Component } from '@angular/core';
import { Router } from '@angular/router'
import { ModalController } from '@ionic/angular';
import { ImgModalPage } from '../img-modal/img-modal.page';
import * as infoGato from '../../assets/data/InfoGato.json';
import { SearchModalPage } from '../search-modal/search-modal.page';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  infoGato: any = (infoGato as any).default;
  infoGatoChunks: any[][] = [];
  searchTerm: string = '';
  filteredInfoGatoChunks: any[][] = [];


  constructor(private router: Router, private modalController: ModalController) {
    for (let i = 0; i < this.infoGato.length; i += 3) {
      this.infoGatoChunks.push(this.infoGato.slice(i, i + 3));
    }
    this.filteredInfoGatoChunks = this.infoGatoChunks;
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

  async openSearchResultsModal(gatos: any[]) {
    const modal = await this.modalController.create({
      component: SearchModalPage,
      componentProps: {
        gatos: gatos
      }
    });
    return await modal.present();
  }

  // onSearch() {
  //   if (!this.searchTerm.trim()) {
  //     this.filteredInfoGatoChunks = this.infoGatoChunks;
  //   } else {
  //     const filteredGatos = this.infoGato.reduce((acc: any[], gato: { Nombre: string; }) => {
  //       if (gato.Nombre.toLowerCase().includes(this.searchTerm.toLowerCase())) {
  //         acc.push(gato);
  //       }
  //       return acc;
  //     }, []);
  //     this.openSearchResultsModal(filteredGatos);
  //   }
  // }

}
