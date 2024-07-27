import { Component, OnInit } from '@angular/core';
import { ImgModalPage } from '../../../components/img-modal/img-modal.page';
import { ModalController } from '@ionic/angular';
import { InfoPerro, Temperamento } from '../../../interface/InfoPerro.models';
import { ModalSwiperPage } from 'src/app/components/modal-swiper/modal-swiper.page';
import { AdmobAds, BannerPosition, BannerSize } from 'capacitor-admob-ads';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-perfil-perro',
  templateUrl: './perfil-perro.page.html',
  styleUrls: ['./perfil-perro.page.scss'],
})
export class PerfilPerroPage implements OnInit {
  selectedSegmentValue: string = 'caracteristicas';
  cardHeading: string = '';
  cardSubtitle: string = '';
  cardContent: string = '';

  infoName!: string;
  infoImage!: string;
  infoOrigin!: string;
  infoHistory!: string;
  showImagesContainer: boolean = false;

  perro: InfoPerro[] = [];
  temperamentoChips: Temperamento[] = [];

  isLoading: boolean = true; // Add this flag

  constructor(private modalCtrl: ModalController) {}

  async ngOnInit() {
    this.loadPerroData(); // Assume this method loads the data
  }

  async loadPerroData() {
    // Simulate data loading
    setTimeout(() => {
      // Load your perro data here
      this.infoName = this.perro[0].Raza;
      this.infoImage = this.perro[0].imgPerfil;
      this.infoOrigin = this.perro[0].Origen;
      this.infoHistory = this.perro[0].Historia;

      this.isLoading = false; // Set the flag to false when data is loaded
    }, 2000); // Simulate 2 seconds of loading time
  }

  changeCardContent(segment: string) {
    this.showImagesContainer = false;

    switch (segment) {
      case 'caracteristicas':
        this.cardHeading = 'Características Físicas';
        this.cardSubtitle = 'Detalles sobre las características físicas';
        this.cardContent = this.perro[0].caracteristicasFisicas.map((caract) => `${caract.tipo}: ${caract.descripcion}`).join('<br>');
        break;
      case 'temperamento':
        this.cardHeading = 'Temperamento';
        this.cardSubtitle = 'Descripción del temperamento';
        this.cardContent = this.perro[0].Temperamento.map((temp) => `${temp.tipo}: ${temp.descripcion}`).join('<br>');
        break;
      case 'cuidado':
        this.cardHeading = 'Cuidados';
        this.cardSubtitle = 'Recomendaciones de cuidados';
        this.cardContent = Object.entries(this.perro[0].Cuidados).map(([key, value]) => `${key}: ${value}`).join('<br>');
        break;
      case 'images':
        this.showImagesContainer = true;
        break;
      default:
        this.cardHeading = '';
        this.cardSubtitle = '';
        this.cardContent = '';
        break;
    }
  }

  getImagesArray(perro: InfoPerro): string[] {
    return perro.Img;
  }

  async openModal(imgUrl: string) {
    const modal = await this.modalCtrl.create({
      component: ImgModalPage,
      componentProps: { imgUrl },
    });
    await modal.present();
  }

  async openModalSwiper(perro: InfoPerro) {
    const modal = await this.modalCtrl.create({
      component: ModalSwiperPage,
      componentProps: { images: perro.Img, id: perro.id },
    });
    await modal.present();
  }

  /*Anuncio Banner  */
  async showAdaptiveBanner() {
    try {
      await AdmobAds.showBannerAd({
        adId: environment.AdmobAds.APP_ID, // ID de tu anuncio de AdMob
        isTesting: false, // Configuración de prueba
        adSize: BannerSize.BANNER, // Tamaño de banner adaptable
        adPosition: BannerPosition.TOP // Posición del banner
      });
      // Cerrar el banner después de cierto tiempo o evento
      setTimeout(async () => {
        try {
          await AdmobAds.removeBannerAd();
        } catch (error) {
          console.error('Error al cerrar el banner adaptable (Banner)', error);
        }
      }, 20000); // Ejemplo: cerrar el banner después de 10 segundos
    } catch (error) {
      console.error('Error al mostrar el banner adaptable (Banner)', error);
    }
  }

}
