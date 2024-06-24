import { Component, OnInit } from '@angular/core';
import { fundaciones } from '../interface/Fundaciones.model';
import { FirestoreService } from '../service/firestore.service';
import { HuachitoService } from '../service/huachito.service';
import { Huachitos } from '../interface/Huachitos.models';
import { ModalController } from '@ionic/angular';
import { ImgModalPage } from '../components/img-modal/img-modal.page';
import { InfoImage } from '../interface/InfoImage.module';
import { AdmobAds, BannerPosition, BannerSize, } from 'capacitor-admob-ads';

@Component({
  selector: 'app-adoptame',
  templateUrl: './adoptame.page.html',
  styleUrls: ['./adoptame.page.scss'],
})
export class AdoptamePage implements OnInit {

  fundaciones: fundaciones[] = [];
  huachito: Huachitos[] = [];
  currentDatoIndex: number = 0;
  texto1showSkeleton: boolean = true;
  showSkeletonPerros: boolean = true;
  mostrarError500: boolean = true;
  originalImg: InfoImage[] = [];
  img: InfoImage[] = [];

  colorsCards = [
    { id: 1, bg: '#FFEBE5', text: '#7e402d' },
    { id: 2, bg: '#FDF1DB', text: '#6e5628' },
    { id: 3, bg: '#CFECFF', text: '#215a80' }
  ];

  constructor(
    private firestores: FirestoreService,
    private huachitoService: HuachitoService,
    private modalController: ModalController,
  ) {
  }

  ionViewDidEnter() {
    this.showAdaptiveBanner();
  }

  ngOnInit(): void {
    this.getQuirkyFacts();
    this.getHuachitos();
    setInterval(() => {
    }, 10000);
    setTimeout(() => {
      this.texto1showSkeleton = false;
      this.showSkeletonPerros = false;
    }, 3000);
  }

  getQuirkyFacts() {
    this.firestores.getCollectionChanges<fundaciones>('fundaciones').subscribe(dato => {
      if (dato) {
        this.fundaciones = dato;
        console.log(dato)
      }
    });
    this.firestores.getCollectionChanges<InfoImage>('InfoImage').subscribe(img => {
      if (img) {
        this.originalImg = img;
        this.img = img
      }
    });
  }
  refugio(url: string) {
    window.open(url, '_blank'); // Abre la URL en una nueva pestaña
  }
  getHuachitos() {
    this.huachitoService.getAnimales().subscribe({
      next: (data) => {
        if (data && data.data) {
          console.log(data)
          this.huachito = data.data;
          this.texto1showSkeleton = false;
          this.mostrarError500 = false;
        }
      },
      error: (error) => {
        console.error('Error al cargar los datos de huachitos:', error);
        if (error.status === 500) {
          this.mostrarError500 = true;
        }
      }
    });
  }

  webUrl = 'https://huachitos.cl/'

  adoptar(url: string) {
    window.open(url, '_blank'); // Abre la URL en una nueva pestaña
  }
  verWeb(webUrl: string) {
    window.open(webUrl, '_blank'); // Abre la URL en una nueva pestaña
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

  /*Anuncio Banner  */
  async showAdaptiveBanner() {
    try {
      await AdmobAds.showBannerAd({
        adId: 'ca-app-pub-6309294666517022/1128036107', // ID de tu anuncio de AdMob
        isTesting: false, // Configuración de prueba
        adSize: BannerSize.FULL_BANNER, // Tamaño de banner adaptable
        adPosition: BannerPosition.TOP // Posición del banner
      });
      console.log('Banner adaptable (Banner) mostrado correctamente');

      // Cerrar el banner después de cierto tiempo o evento
      setTimeout(async () => {
        try {
          await AdmobAds.removeBannerAd();
          console.log('Banner adaptable (Banner) cerrado correctamente');
        } catch (error) {
          console.error('Error al cerrar el banner adaptable (Banner)', error);
        }
      }, 15000); // Ejemplo: cerrar el banner después de 10 segundos
    } catch (error) {
      console.error('Error al mostrar el banner adaptable (Banner)', error);
    }
  }

}
