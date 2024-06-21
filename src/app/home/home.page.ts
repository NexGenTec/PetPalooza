import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../service/firestore.service';
import { InfoGato } from '../interface/InfoGato.models';
import { InfoPerro } from '../interface/InfoPerro.models';
import { QuirkyFacts } from '../interface/QuirkyFacts.models';
import { Storage } from '@ionic/storage';
import { WelcomeModalPage } from '../components/welcome-modal/welcome-modal.page';
import { ModalController, ToastController } from '@ionic/angular';
import { InfoAve } from '../interface/InfoAve.models';
import { ImgModalPage } from '../components/img-modal/img-modal.page';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class homePage implements OnInit {

  gatos: InfoGato[] = [];
  perros: InfoPerro[] = [];
  aves: InfoAve[] = [];
  infoPerro: any = (this.perros as any).default;
  infoPerroChunks: any[][] = [];

  DatosFreak: QuirkyFacts[] = [];
  currentDatoIndex: number = 0;
  currentView: string = 'Últimos';
  showImage: boolean;
  isLoadingData: boolean = false;
  favorites: any[] = [];
  originalGatos: InfoGato[] = [];
  originalPerros: InfoPerro[] = [];
  originalAves: InfoAve[] = [];
  loaded: boolean = false;
  showSkeletonUltimos: boolean = true;
  navigateToCatshowSkeleton: boolean = true;
  datoFreakshowSkeleton: boolean = true;
  texto1showSkeleton: boolean = true;
  showSkeletonGatos: boolean = true;
  showSkeletonPerros: boolean = true;

  breakpointsRegisteredAnimals = {
    0: { slidesPerView: 1.15 },
    340: { slidesPerView: 2.15 },
    480: { slidesPerView: 3.15 },
    640: { slidesPerView: 4.15 },
    768: { slidesPerView: 5.15 },
  };

  constructor(
    private router: Router,
    private firestores: FirestoreService,
    private storage: Storage,
    private modalController: ModalController,
    private toastController: ToastController
  ) {
  }

  ngOnInit(): void {
    this.getQuirkyFacts();
    this.loadFavorites();
    this.loadData();
    this.showImage = false;
    this.initStorage();
    setInterval(() => {
      this.showRandomQuirkyFact();
    }, 30000);
    this.loadData();
    setTimeout(() => {
      this.loadFavorites();
      this.loaded = true;
    }, 3000);
    setTimeout(() => {
      this.showSkeletonUltimos = false;
      this.navigateToCatshowSkeleton = false;
      this.datoFreakshowSkeleton = false;
      this.texto1showSkeleton = false;
      this.showSkeletonGatos = false;
      this.showSkeletonPerros = false;
    }, 3000);
  }
  /*/
  Se llama la data de Perros y Gatos
  */
  async loadData() {
    this.firestores.getCollectionChanges<InfoGato>('InfoGato').subscribe(gatos => {
      if (gatos) {
        this.originalGatos = gatos;
        this.gatos = gatos
          .filter(gato => gato.fechaCreacion && gato.fechaCreacion.seconds)
          .sort((a, b) => b.fechaCreacion.seconds - a.fechaCreacion.seconds)
          //Cantida de Gatos en ultimos
          .slice(0, 2);
      }
    });

    this.firestores.getCollectionChanges<InfoPerro>('InfoPerro').subscribe(perros => {
      if (perros) {
        this.originalPerros = perros;
        this.perros = perros
          .filter(perro => perro.fechaCreacion && perro.fechaCreacion.seconds)
          .sort((a, b) => b.fechaCreacion.seconds - a.fechaCreacion.seconds)
          //Cantida de Perros en ultimos
          .slice(0, 2);
      }
    });

    this.firestores.getCollectionChanges<InfoAve>('InfoAve').subscribe(aves => {
      if (aves) {
        this.originalAves = aves;
        this.aves = aves
          .filter(ave => ave.fechaCreacion && ave.fechaCreacion.seconds)
          .sort((a, b) => b.fechaCreacion.seconds - a.fechaCreacion.seconds)
          //Cantida de Perros en ultimos
          .slice(0, 2);
      }
    });
  }


  toggleView(view: string) {
    this.currentView = view;
  }

  getQuirkyFacts() {
    this.firestores.getCollectionChanges<QuirkyFacts>('QuirkyFacts').subscribe(dato => {
      if (dato) {
        this.DatosFreak = dato;
        this.showRandomQuirkyFact();
      }
    });
  }

  loadFavorites() {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      this.favorites = JSON.parse(storedFavorites);
    }
  }


  showRandomQuirkyFact() {
    const randomIndex = Math.floor(Math.random() * this.DatosFreak.length);
    this.currentDatoIndex = randomIndex;
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

  navigateToCat() {
    this.router.navigate(['/tabs/gato']);
  }


  navigateToDog() {
    this.router.navigate(['/tabs/perro']);
  }

  navigateToFavorites() {
    this.router.navigate(['/favoritos']);
  }

  navigateToTargetPage(segment: string, gato: InfoGato) {
    this.router.navigate([segment, gato.id], { state: { data: gato } });
  }

  navigateToTargetPage2(segment: string, perro: InfoPerro) {
    this.router.navigate([segment, perro.id], { state: { data: perro } });
  }

  async initStorage() {
    await this.storage.create();
    const isFirstTime = await this.storage.get('isFirstTime');
    if (!isFirstTime) {
      await this.storage.set('isFirstTime', true);
      this.presentWelcomeModal();
      this.showImage = true;
    } else {
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


  intercalate(gatos: any[], perros: any[]): any[] {
    const result = [];
    const maxLength = Math.max(gatos.length, perros.length);

    for (let i = 0; i < maxLength; i++) {
      if (gatos[i]) {
        gatos[i].type = 'gato';
        result.push(gatos[i]);
      }
      if (perros[i]) {
        perros[i].type = 'perro';
        result.push(perros[i]);
      }
    }
    return result;
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

}
