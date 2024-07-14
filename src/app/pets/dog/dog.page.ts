import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../service/firestore.service';
import { InfoPerro } from '../../interface/InfoPerro.models';
import { ModalController } from '@ionic/angular';
import { ImgModalPage } from 'src/app/img-modal/img-modal.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dog',
  templateUrl: './dog.page.html',
  styleUrls: ['./dog.page.scss'],
})
export class DogPage implements OnInit {
  perros: InfoPerro[] = [];
  currentDatoIndex: number = 0;
  infoPerroChunks: InfoPerro[][] = [];
  filteredPerros: InfoPerro[] = [];
  searchTerm: string = '';



  constructor(
    private firestores: FirestoreService,
    private router: Router,
    private modalController: ModalController,
  ) {
    this.loadData();
  }


  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.firestores.getCollectionChanges<InfoPerro>('InfoPerro').subscribe(perro => {
      if (perro) {
        this.perros = perro
        this.filteredPerros = [...this.perros];
        console.log(perro)
        console.log(this.perros)
      }
    })
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


  navigateToTargetPage(segment: string, perro: InfoPerro) {
    this.router.navigate([segment, perro.id], { state: { data: perro } });
  }

  filterPerros() {
    console.log('Search term:', this.searchTerm);
    this.filteredPerros = this.perros.filter(gato =>
      gato.Raza.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    console.log('Filtered gatos:', this.filteredPerros);
  }
}