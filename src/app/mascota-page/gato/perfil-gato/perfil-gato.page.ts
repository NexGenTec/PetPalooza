import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { ImgModalPage } from '../../../components/img-modal/img-modal.page';
import { CaracteristicasFisicas, Cuidado, InfoGato, Temperamento } from '../../../interface/InfoGato.models';
import { ModalSwiperPage } from 'src/app/components/modal-swiper/modal-swiper.page';
import { AdmobAds, BannerPosition, BannerSize } from 'capacitor-admob-ads';
import { ActionPerformed, PushNotifications } from '@capacitor/push-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { DataOflineService } from 'src/app/service/data-ofline.service';
import { environment } from '../../../../environments/environment.prod';
@Component({
  selector: 'app-perfil-gato',
  templateUrl: './perfil-gato.page.html',
  styleUrls: ['./perfil-gato.page.scss'],
})
export class PerfilGatoPage implements OnInit {

  selectedSegmentValue: string = 'caracteristicas';
  cardHeading: string = '';
  cardSubtitle: string = '';
  cardContent: string = '';

  infoName!: string;
  infoImage!: string;
  infoOrigin!: string;
  infoHistory!: string;

  gato!: InfoGato;
  showImagesContainer: boolean = false;
  temperamentoChips: Temperamento[] = [];
  id: string;

  isLoading: boolean = true;

  constructor(
    private modalController: ModalController,
    private platform: Platform,
    private router: Router,
    private route: ActivatedRoute,
    private ofline: DataOflineService,
    private loadingController: LoadingController ) {}

  ngOnInit() {
    this.platform.ready().then(() => {
      PushNotifications.addListener('pushNotificationActionPerformed', async (notification: ActionPerformed) => {
        const data = notification.notification.data;
        
        if (data && data.Route) {
          const route = data.Route.split('/');
          this.id = route[1];
          console.log('Redirigiendo a:', data.Route);
  
          const loading = await this.showLoading();
  
          // Navigate to the route and load data
          this.router.navigate([data.Route]).then(() => {
            this.loadGatoData().finally(() => {
              // Dismiss loading spinner
              loading.dismiss();
            });
          });
        } else {
          console.error('No se encontró una ruta en los datos de notificación.');
        }
      });
    });
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.loadGatoData().finally(() => {

      });
    } else if (history.state.data) {
      this.gato = history.state.data;
      this.populateGatoData();
    }
  }        

  async showLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando datos del gato...',
    });
    await loading.present();
    return loading;
  }

  async loadGatoData() {
    const loading = await this.showLoading();
  
    if (this.id) {
      this.ofline.getGatoById(this.id).subscribe({
        next: (data) => {
          this.gato = data;
          this.populateGatoData();
          loading.dismiss();
          this.isLoading = false; // Data loaded, set isLoading to false
        },
        error: (error) => {
          console.error("Error al cargar la data: ", error);
          loading.dismiss();
          this.isLoading = false; // Error occurred, set isLoading to false
        }
      });
    }
  }  

  populateGatoData() {
    if (this.gato) {
      this.infoName = this.gato.Raza;
      this.infoOrigin = this.gato.Origen;
      this.infoImage = this.gato.imgPerfil;
      this.infoHistory = this.gato.Historia;
      this.changeCardContent(this.selectedSegmentValue);
    }
  }

  getImagesArray(gato: InfoGato): string[] {
    return Object.values(gato.Img);
  }

  changeCardContent(segmentValue: string) {
    if (!this.gato) return;

    switch (segmentValue) {
      case 'caracteristicas':
        this.setCardContent('Características Físicas', this.gato.Raza, this.formatCharacteristics(this.gato.caracteristicasFisicas));
        this.temperamentoChips = [];
        this.showImagesContainer = false;
        break;
      case 'temperamento':
        this.setCardContent('Temperamento', '', this.formatTemperamento(this.gato.Temperamento));
        this.temperamentoChips = this.gato.Temperamento.filter(temp => temp.tipo);
        this.showImagesContainer = false;
        break;
      case 'cuidado':
        this.setCardContent('Cuidado y Salud', this.gato.Raza, this.formatCuidado(this.gato.Cuidados));
        this.temperamentoChips = [];
        this.showImagesContainer = false;
        break;
      case 'images':
        this.setCardContent('Imágenes', this.gato.Raza, '');
        this.temperamentoChips = [];
        this.showImagesContainer = true;
        break;
      default:
        this.changeCardContent('caracteristicas');
        break;
    }
  }

  setCardContent(heading: string, subtitle: string, content: string) {
    this.cardHeading = heading;
    this.cardSubtitle = subtitle;
    this.cardContent = content;
  }

  formatCharacteristics(characteristics: CaracteristicasFisicas[]): string {
    return characteristics
      .map(item => `<p><span class="font-bold">${item.tipo}:</span> ${item.descripcion}</p>`)
      .join('<hr class="my-3">');
  }

  formatTemperamento(temperamento: Temperamento[]): string {
    return temperamento
      .filter(temp => temp.descripcion !== '')
      .map(temp => `<p>${temp.descripcion}</p>`)
      .join('<hr class="my-3">');
  }

  formatCuidado(cuidados: Cuidado[]): string {
    return cuidados
      .map(item => `<p><span class="font-bold">${item.tipo}:</span> ${item.descripcion}</p>`)
      .join('<hr class="my-3">');
  }

  async openModal(imageUrl: string) {
    const modal = await this.modalController.create({
      component: ImgModalPage,
      componentProps: { imageUrl }
    });
    await modal.present();
  }

  async openModalSwiper(gato: InfoGato) {
    const modal = await this.modalController.create({
      component: ModalSwiperPage,
      componentProps: { images: this.getImagesArray(gato), initialSlide: 0 }
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
      console.log('Banner adaptable (Banner) mostrado correctamente');

      // Cerrar el banner después de cierto tiempo o evento
      setTimeout(async () => {
        try {
          await AdmobAds.removeBannerAd();
          console.log('Banner adaptable (Banner) cerrado correctamente');
        } catch (error) {
          console.error('Error al cerrar el banner adaptable (Banner)', error);
        }
      }, 20000); // Ejemplo: cerrar el banner después de 10 segundos
    } catch (error) {
      console.error('Error al mostrar el banner adaptable (Banner)', error);
    }
  }
}
  