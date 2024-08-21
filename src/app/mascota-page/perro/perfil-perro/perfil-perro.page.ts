import { Component, OnInit } from '@angular/core';
import { ImgModalPage } from '../../../components/img-modal/img-modal.page';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { CaracteristicasFisicas, Cuidado, ImgUser, InfoPerro, Temperamento } from '../../../interface/InfoPerro.models';
import { ModalSwiperPage } from 'src/app/components/modal-swiper/modal-swiper.page';
import { AdmobAds, BannerPosition, BannerSize } from 'capacitor-admob-ads';
import { environment } from '../../../../environments/environment.prod';
import { ActivatedRoute, Router } from '@angular/router';
import { DataOflineService } from 'src/app/service/data-ofline.service';
import { ActionPerformed, PushNotifications } from '@capacitor/push-notifications';
import { AddImagePage } from '../add-image/add-image.page';
import { StorageService } from '../../../service/storage.service';

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
  Longevidad!:string;

  favorites: any[] = [];

  perro!: InfoPerro;
  showImagesContainer: boolean = false;
  temperamentoChips: Temperamento[] = [];
  id: string;

  isLoading: boolean = true;
  isLoadingImg: boolean = true;

  constructor(
    private modalController: ModalController,
    private platform: Platform,
    private router: Router,
    private route: ActivatedRoute,
    private ofline: DataOflineService,
    private favoritesService: StorageService,
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
            this.loadPerroData().finally(() => {
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
      this.loadPerroData().finally(() => {

      });
    } else if (history.state.data) {
      this.perro = history.state.data;
      this.populatePerroData();
    }
  }        

  async showLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando datos del perro...',
    });
    await loading.present();
    return loading;
  }

  async loadPerroData() {
    const loading = await this.showLoading();
  
    if (this.id) {
      this.ofline.getPerroById(this.id).subscribe({
        next: (data) => {
          this.perro = data;
          this.populatePerroData();
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

  populatePerroData() {
    if (this.perro) {
      this.infoName = this.perro.Raza;
      this.infoOrigin = this.perro.Origen;
      this.infoImage = this.perro.imgPerfil;
      this.infoHistory = this.perro.Historia;
      this.Longevidad = this.perro.Longevidad;
      this.changeCardContent(this.selectedSegmentValue);
    }
  }

  getImagesArray(perro: InfoPerro): string[] {
    return Object.values(perro.Img);
  }
  getImageUsersArray(perro: InfoPerro): ImgUser[] {
    console.log('ImgUsers Array:', perro.ImgUsers);
    return perro.ImgUsers;
  }
    
  changeCardContent(segmentValue: string) {
    if (!this.perro) return;
    this.isLoadingImg = true; 

    switch (segmentValue) {
      case 'caracteristicas':
        this.setCardContent('Características Físicas', this.perro.Raza, this.formatCharacteristics(this.perro.caracteristicasFisicas));
        this.temperamentoChips = [];
        this.showImagesContainer = false;
        break;
      case 'temperamento':
        this.setCardContent('Temperamento', '', this.formatTemperamento(this.perro.Temperamento));
        this.temperamentoChips = this.perro.Temperamento.filter(temp => temp.tipo);
        this.showImagesContainer = false;
        break;
      case 'cuidado':
        this.setCardContent('Cuidado y Salud', this.perro.Raza, this.formatCuidado(this.perro.Cuidados));
        this.temperamentoChips = [];
        this.showImagesContainer = false;
        break;
      case 'images':
        this.setCardContent('Imágenes', this.perro.Raza, '');
        this.temperamentoChips = [];
        this.showImagesContainer = true;
        setTimeout(() => {
          this.isLoadingImg = false;
        }, 1000);
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

  async openModalSwiper(perro: InfoPerro) {
    const modal = await this.modalController.create({
      component: ModalSwiperPage,
      componentProps: { images: this.getImagesArray(perro), initialSlide: 0 }
    });
    await modal.present();
  }
  async openModalSwiperUser(perro: InfoPerro) {
    const modal = await this.modalController.create({
      component: ModalSwiperPage,
      componentProps: { images: this.getImageUsersArray(perro), initialSlide: 0 }
    });
    await modal.present();
  }

  async onAddImage() {
    const modal = await this.modalController.create({
      component: AddImagePage,
      componentProps: { perroRaza: this.perro.Raza ,  perroId: this.perro.id }
    });
    console.log('Gato ID al crear modal:', this.perro.Raza);  // Verifica que gato.id no sea undefined
    await modal.present();
  }  

  // Like button
  private loadFavorites() {
    this.favorites = this.favoritesService.getFavorites();
  }
  
  isInFavorites(animal: any, type: string): boolean {
    return this.favoritesService.isInFavorites(animal, type);
  }

  async addToFavorites(animal: any, type: string) {
    await this.favoritesService.addToFavorites(animal, type);
    this.loadFavorites();  // Actualizar la lista de favoritos después de agregar o eliminar
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
  