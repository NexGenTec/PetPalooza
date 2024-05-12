import { Component } from '@angular/core';
import { InfoPerro } from '../interface/InfoPerro.models';
import { QuirkyFacts } from '../interface/QuirkyFacts.models';
import { FirestoreService } from '../service/firestore.service';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ImgModalPage } from '../img-modal/img-modal.page';

@Component({
  selector: 'app-perro',
  templateUrl: 'perro.page.html',
  styleUrls: ['perro.page.scss']
})
export class perroPage {
  perros: InfoPerro[] = [];
  DatosFreak: QuirkyFacts[] = [];
  currentDatoIndex: number = 0;
  infoPerroChunks: InfoPerro[][] = [];



  constructor(
    private firestores: FirestoreService,
    private router: Router, private modalController: ModalController) {
    this.loadData();
  }


  ngOnInit(): void {
    this.getQuirkyFacts();
    setInterval(() => {
      this.showRandomQuirkyFact();
    }, 10000);
    this.loadData();
  }

  loadData() {
    this.firestores.getCollectionChanges<InfoPerro>('InfoPerro').subscribe(perro => {
      if (perro) {
        this.perros = perro
      }
    })
  }

  getQuirkyFacts() {
    this.firestores.getCollectionChanges<QuirkyFacts>('QuirkyFacts').subscribe(dato => {
      if (dato) {
        this.DatosFreak = dato;
        this.showRandomQuirkyFact();
      }
    });
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


  showRandomQuirkyFact() {
    const randomIndex = Math.floor(Math.random() * this.DatosFreak.length);
    this.currentDatoIndex = randomIndex;
  }
}
