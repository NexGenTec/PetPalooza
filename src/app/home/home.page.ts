
import { Component } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ImgModalPage } from '../img-modal/img-modal.page';
import * as infoPerro from '../../assets/data/InfoPerro.json';
import { SearchModalPage } from '../search-modal/search-modal.page';
import * as infoGato from '../../assets/data/InfoGato.json';
import { Storage } from '@ionic/storage';
import { WelcomeModalPage } from '../welcome-modal/welcome-modal.page';
import { FirebaseDatabaseService } from '../service/firebase-database.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class homePage implements OnInit {
  infoGato: any = (infoGato as any).default;
  infoPerro: any = (infoPerro as any).default;
  infoPerroChunks: any[][] = [];
  infoGatoChunks: any[][] = [];
  combinedAnimals: any[] = [];
  mascotas:any[] = [];
  showImage: boolean;


  constructor(private router: Router, private modalController: ModalController,
    private firebaseService: FirebaseDatabaseService
    private storage: Storage,
    private toastController: ToastController
  ) {
    for (let i = 0; i < this.infoPerro.length; i += 1) {
      this.infoPerroChunks.push(this.infoPerro.slice(i, i + 1));
    }
    for (let i = 0; i < this.infoGato.length; i += 1) {
      this.infoGatoChunks.push(this.infoGato.slice(i, i + 1));
    }
    // this.combineAnimals();
    this.showImage = false;
    /* this.initStorage(); */
  }

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.firebaseService.getGatos().subscribe(gatos => {
      this.infoGato = gatos;
      this.infoGatoChunks = this.chunkArray(this.infoGato, 3); // Ejemplo de dividirlos en chunks de 3 elementos
    });

    this.firebaseService.getPerros().subscribe(perros => {
      this.infoPerro = perros;
      this.infoPerroChunks = this.chunkArray(this.infoPerro, 3); // Ejemplo de dividirlos en chunks de 3 elementos
    });
  }


  chunkArray(array: any[], size: number): any[][] {
    return array.reduce((chunks, item, index) => {
      if (index % size === 0) {
        chunks.push([item]);
      } else {
        chunks[chunks.length - 1].push(item);
      }
      return chunks;
    }, []);
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

  async presentWelcomeModal() {
    const modal = await this.modalController.create({
      component: WelcomeModalPage,
      backdropDismiss: false
    });
    return await modal.present();
  }

  // Función para guardar los favoritos
  async guardarGatoFavorito(gato: any) {
    let gatosFavoritos = await this.storage.get('gatosFavoritos');
    if (!gatosFavoritos) {
      gatosFavoritos = [];
    }
    gatosFavoritos.push(gato);
    await this.storage.set('gatosFavoritos', gatosFavoritos);
    this.presentToast('Se ha agregado a favoritos');
  }

  async guardarPerroFavorito(perro: any) {
    let perrosFavoritos = await this.storage.get('perrosFavoritos');
    if (!perrosFavoritos) {
      perrosFavoritos = [];
    }
    perrosFavoritos.push(perro);
    await this.storage.set('perrosFavoritos', perrosFavoritos);
    this.presentToast('Se ha agregado a favoritos');
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duración del toast en milisegundos
      position: 'bottom' // Posición del toast (arriba, abajo, centro)
    });
    toast.present();
  }

  navigateToFavorites() {
    this.router.navigate(['/favoritos']);
  }

}
