import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../service/firestore.service';
import { InfoGato } from '../interface/InfoGato.models';
import { InfoPerro } from '../interface/InfoPerro.models';
import { QuirkyFacts } from '../interface/QuirkyFacts.models';
import { Storage } from '@ionic/storage';
import { WelcomeModalPage } from '../welcome-modal/welcome-modal.page';
import { ModalController, ToastController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class homePage implements OnInit {

  gatos: InfoGato[] = [];
  perros: InfoPerro[] = [];
  infoPerro: any = (this.perros as any).default;
  infoPerroChunks: any[][] = [];

  DatosFreak: QuirkyFacts[] = [];
  currentDatoIndex: number = 0;
  currentView: string = 'Últimos';
  showImage: boolean;
  isLoadingData: boolean = false;




  constructor(
    private router: Router,
    private firestores: FirestoreService,
    private storage: Storage,
    private modalController: ModalController,
    private toastController: ToastController
  ) {
    this.loadData();
    this.showImage = false;
    this.initStorage();
  }

  ngOnInit(): void {
    this.getQuirkyFacts();
    setInterval(() => {
      this.showRandomQuirkyFact();
    }, 10000);
    this.loadData();
  }

  loadData() {
    this.firestores.getCollectionChanges<InfoGato>('InfoGato').subscribe(gato => {
      if (gato) {
        this.gatos = gato
      }
    })
    this.firestores.getCollectionChanges<InfoPerro>('InfoPerro').subscribe(perro => {
      if (perro) {
        this.perros = perro
      }
    })
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

  showRandomQuirkyFact() {
    const randomIndex = Math.floor(Math.random() * this.DatosFreak.length);
    console.log("Dato Freak actual:", this.DatosFreak[randomIndex]?.id);
    this.currentDatoIndex = randomIndex;
  }



  async addToFavorites(perro: any) {
    let favorites: any[] = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favorites.findIndex(favorite => favorite.id === perro.id);
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
      favorites.push(perro);
      const toast = await this.toastController.create({
        message: 'Agregado a favoritos',
        duration: 2000,
        position: 'top',
        color: 'success'
      });
      toast.present();
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
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

  navigateToTargetPage(segment: string, gatoId: string) {
    this.router.navigate([segment, gatoId]);
  }

  navigateToTargetPage2(segment: string, perro: InfoPerro) {
    this.router.navigate([segment, perro.id], { state: { data: perro } });
  }

  async initStorage() {
    await this.storage.create();
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
