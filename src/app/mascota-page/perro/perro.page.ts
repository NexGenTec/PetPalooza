import { Component } from '@angular/core';
import { InfoPerro } from '../../interface/InfoPerro.models';
import { QuirkyFacts } from '../../interface/QuirkyFacts.models';
import { FirestoreService } from '../../service/firestore.service';
import { Router } from '@angular/router';
import { ImgModalPage } from '../../components/img-modal/img-modal.page';
import { ModalController, ToastController } from '@ionic/angular';

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
  filteredPerros: InfoPerro[] = [];
  favorites: any[] = [];
  searchTerm: string = '';



  constructor(
    private firestores: FirestoreService,
    private toastController: ToastController,
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
        this.filteredPerros = [...this.perros];
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
    const perroIndices = this.DatosFreak.map((fact, index) => {
      return fact.categoria === 'perro' ? index : null;
    }).filter(index => index !== null);

    if (perroIndices.length > 0) {
      const randomIndex = perroIndices[Math.floor(Math.random() * perroIndices.length)];
      this.currentDatoIndex = randomIndex;
    } else {
      console.log("No hay datos disponibles con la categoría Gato");
    }
  }

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

  isInFavorites(animal: any, type: string): boolean {
    const favorites: any[] = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.some(favorite => favorite.id === animal.id && favorite.type === type);
  }

  async addToFavorites(animal: any, type: string) {
    let favorites: any[] = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favorites.findIndex(favorite => favorite.id === animal.id && favorite.type === type);
    if (index !== -1) {
      favorites.splice(index, 1);
      const toast = await this.toastController.create({
        message: 'Eliminado de favoritos',
        duration: 2000,
        position: 'top',
        color: 'danger'
      });
      toast.present();
    } else {
      animal.type = type; // Agregar el tipo de animal (perro o gato)
      favorites.push(animal);
      const toast = await this.toastController.create({
        message: 'Agregado a favoritos',
        duration: 2000,
        position: 'top',
        color: 'success'
      });
      toast.present();
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    this.favorites = favorites;
  }

}
