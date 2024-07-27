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
import { InfoImage } from '../interface/InfoImage.models';
import { AdmobAds, BannerPosition, BannerSize, } from 'capacitor-admob-ads';
import { StorageService } from '../service/storage.service';
import { NotificationsService } from '../service/notifications.service';
import { environment } from '../../environments/environment.prod';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class homePage implements OnInit {
  

  gatos: InfoGato[] = [];
  perros: InfoPerro[] = [];
  aves: InfoAve[] = [];
  img: InfoImage[] = [];
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
  originalImg: InfoImage[] = [];
  loaded: boolean = false;
  showSkeletonUltimos: boolean = true;
  navigateToCatshowSkeleton: boolean = true;
  datoFreakshowSkeleton: boolean = true;
  texto1showSkeleton: boolean = true;
  showSkeletonGatos: boolean = true;
  showSkeletonPerros: boolean = true;
  ads: Array<any> = [];
  showMediumRectangle: boolean = true;
  showBanner: boolean = true;
  showFullBanner: boolean = true;
  showLargeBanner: boolean = true;

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
    private favoritesService: StorageService,
    private pushNotificationService: NotificationsService,
  ) {
  }

  ionViewDidEnter() {
    this.showAdaptiveBanner();
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
    this.pushNotificationService.initPushNotifications();
  }
  /*/
  Se llama la data de Perros y Gatos
  */
  async loadData() {
    this.firestores.getCollectionChanges<InfoGato>('InfoGatos').subscribe(gatos => {
      if (gatos) {
        this.originalGatos = gatos;
        this.gatos = gatos
          .filter(gato => gato.fechaCreacion && gato.fechaCreacion.seconds)
          .sort((a, b) => b.fechaCreacion.seconds - a.fechaCreacion.seconds)
          //Cantida de Gatos en ultimos
          .slice(0, 2);
      }
    });

    this.firestores.getCollectionChanges<InfoPerro>('InfoPerros').subscribe(perros => {
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
    this.firestores.getCollectionChanges<InfoImage>('InfoImage').subscribe(img => {
      if (img) {
        this.originalImg = img;
        this.img = img
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

  private loadFavorites() {
    this.favorites = this.favoritesService.getFavorites();
  }


  showRandomQuirkyFact() {
    const randomIndex = Math.floor(Math.random() * this.DatosFreak.length);
    this.currentDatoIndex = randomIndex;
  }

  isInFavorites(animal: any, type: string): boolean {
    return this.favoritesService.isInFavorites(animal, type);
  }

  async addToFavorites(animal: any, type: string) {
    await this.favoritesService.addToFavorites(animal, type);
    this.loadFavorites();  // Actualizar la lista de favoritos después de agregar o eliminar
  }

  navigateToCat() {
    console.log('Navegando a:',);
    this.router.navigate(['/tabs/gato']);
  }


  navigateToDog() {
    this.router.navigate(['/tabs/perro']);
  }

  navigateToFavorites() {
    this.router.navigate(['/favoritos']);
  }

  navigateToTargetPage(segment: string, gato: InfoGato) {
    console.log('Navegando a:', segment, gato.id);
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
    })
    return await modal.present();
  }

  /*Anuncio Banner  */
  async showAdaptiveBanner() {
    try {
      await AdmobAds.showBannerAd({
        adId: environment.AdmobAds.APP_ID, // ID de tu anuncio de AdMob
        isTesting: false, // Configuración de prueba
        adSize: BannerSize.FULL_BANNER, // Tamaño de banner adaptable
        adPosition: BannerPosition.TOP // Posición del banner
      });
      console.log('Banner adaptable (Full Banner) mostrado correctamente');

      // Cerrar el banner después de cierto tiempo o evento
      setTimeout(async () => {
        try {
          await AdmobAds.removeBannerAd();
          console.log('Banner adaptable (Full Banner) cerrado correctamente');
        } catch (error) {
          console.error('Error al cerrar el banner adaptable (Full Banner)', error);
        }
      }, 10000); // Ejemplo: cerrar el banner después de 10 segundos
    } catch (error) {
      console.error('Error al mostrar el banner adaptable (Full Banner)', error);
    }
  }
}


