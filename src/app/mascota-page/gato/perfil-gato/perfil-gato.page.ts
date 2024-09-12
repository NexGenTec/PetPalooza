import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { ImgModalPage } from '../../../components/img-modal/img-modal.page';
import { CaracteristicasFisicas, Cuidado, ImgUser, InfoGato, Temperamento } from '../../../interface/InfoGato.models';
import { ModalSwiperPage } from 'src/app/components/modal-swiper/modal-swiper.page';
import { ActionPerformed, PushNotifications } from '@capacitor/push-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { DataOflineService } from 'src/app/service/data-ofline.service';
import { AddImagePage } from '../add-image/add-image.page';
import { StorageService } from '../../../service/storage.service';
import { ModalswiperUsersPage } from 'src/app/components/modalswiper-users/modalswiper-users.page';
import { Share } from '@capacitor/share';
import { ReactionService } from 'src/app/service/reaction.service';
import { Device } from '@capacitor/device';
import { v4 as uuidv4 } from 'uuid';
import { InteractionService } from 'src/app/service/interaction.service';

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
  Longevidad!: string;

  favorites: any[] = [];

  gato!: InfoGato;
  showImagesContainer: boolean = false;
  temperamentoChips: Temperamento[] = [];
  id: string;
  isLoading: boolean = true;
  isLoadingImg: boolean = true;
  deviceId: string;

  constructor(
    private modalController: ModalController,
    private platform: Platform,
    private router: Router,
    private route: ActivatedRoute,
    private ofline: DataOflineService,
    private favoritesService: StorageService,
    private loadingController: LoadingController,
    private firebaseService: ReactionService,
    private interactionService: InteractionService) {
      this.deviceId = localStorage.getItem('deviceId') || uuidv4();
      localStorage.setItem('deviceId', this.deviceId);
    }


  async ngOnInit() {
    this.platform.ready().then(() => {
      PushNotifications.addListener('pushNotificationActionPerformed', async (notification: ActionPerformed) => {
        const data = notification.notification.data;

        if (data && data.Route) {
          const route = data.Route.split('/');
          this.id = route[1];
          const loading = await this.showLoading();
          this.router.navigate([data.Route]).then(() => {
            this.loadGatoData().finally(() => {
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
    try {
      const deviceIdInfo = await Device.getId();
      console.log('ID del dispositivo:', deviceIdInfo.identifier);
      this.deviceId = deviceIdInfo.identifier || this.deviceId;
      console.log('ID del dispositivo:', this.deviceId);
    } catch (error) {
      console.error('Error al obtener el identificador del dispositivo:', error);
    }
  }

  async shareContent(tipo: 'gato' | 'perro') {
    if (!this.gato) {
        console.error('No hay datos del perfil para compartir.');
        return;
    }

    const perfilId = this.gato.id;
    const truncatedHistory = this.truncateText(this.gato.Historia, 250);
    const shareTitle = `¡Conoce a ${this.gato.Raza}!`;
    const imageUrl = this.gato.imgPerfil; // URL pública de la imagen
    const shareText = `${tipo === 'gato' ? '🐱' : '🐶'} **${this.gato.Raza}**\n\n` +
                      `🌟 **Historia:** ${truncatedHistory}\n` +
                      `🌍 **Origen:** ${this.gato.Origen}\n\n` +
                      `¡Descubre más sobre este increíble ${tipo} y muchos otros en nuestra app!`;

    const shareUrl = `https://play.google.com/store/apps/details?id=com.nexgentech.petpaloozaa`;

    try {
        await Share.share({
          title: shareTitle,
            text: `${shareText}\n\nMás información: ${shareUrl}`,
            url: imageUrl,
            dialogTitle: 'Compartir con',
        });
    } catch (error) {
        console.error('Error al compartir contenido:', error);
    }
  }  
  
  truncateText(text: string, maxLength: number = 40): string {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

  async showLoading() {
    const loading = await this.loadingController.create({
      duration: 5000,
      mode:'ios'
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
          this.isLoading = false;
        },
        error: (error) => {
          console.error("Error al cargar la data: ", error);
          loading.dismiss();
          this.isLoading = false;
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
      this.Longevidad = this.gato.Longevidad;
      this.changeCardContent(this.selectedSegmentValue);
    }
  }

  getImagesArray(gato: InfoGato): string[] {
    return Array.isArray(gato?.Img) ? Object.values(gato.Img) : [];
  }

  getImageUsersArray(gato: InfoGato): ImgUser[] {
    return Array.isArray(gato?.ImgUsers) ? gato.ImgUsers : [];
  }
  changeCardContent(segmentValue: string) {
    if (!this.gato) return;
    this.isLoadingImg = true;

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

  async openModalSwiper(gato: InfoGato) {
    const modal = await this.modalController.create({
      component: ModalSwiperPage,
      componentProps: { images: this.getImagesArray(gato), initialSlide: 0 }
    });
    await modal.present();
  }

  private loadFavorites() {
    this.favorites = this.favoritesService.getFavorites();
  }
  isInFavorites(animal: any, type: string): boolean {
    return this.favoritesService.isInFavorites(animal, type);
  }

  async addToFavorites(animal: any, type: string) {
    this.interactionService.triggerLike(); 
    await this.favoritesService.addToFavorites(animal, type);
    this.loadFavorites();
  }

  async openModalSwiperUser(gato: InfoGato, selectedImage: ImgUser) {
    try {
      const images: ImgUser[] = this.getImageUsersArray(gato);

      const initialSlideIndex = images.findIndex(img => img.url === selectedImage.url);

      const modal = await this.modalController.create({
        component: ModalswiperUsersPage,
        componentProps: {
          images,
          initialSlide: initialSlideIndex
        }
      });

      await modal.present();
    } catch (error) {
      console.error('Error presenting modal:', error);
    }
  }
  async onAddImage() {
    const modal = await this.modalController.create({
      component: AddImagePage,
      componentProps: { gatoRaza: this.gato.Raza, gatoId: this.gato.id }
    });
    await modal.present();
  }

  async toggleLike(imgUser: ImgUser) {
    imgUser.likedDevices = imgUser.likedDevices || [];
    const hasAlreadyLiked = imgUser.likedDevices.includes(this.deviceId);

    if (!hasAlreadyLiked) {
      imgUser.likedDevices.push(this.deviceId);
      imgUser.likeCount = (imgUser.likeCount || 0) + 1;
    } else {
      imgUser.likedDevices = imgUser.likedDevices.filter(id => id !== this.deviceId);
      imgUser.likeCount = (imgUser.likeCount || 0) - 1;
    }

    await this.firebaseService.updateImgUserInGato(this.gato.id, imgUser.url, { 
      likedDevices: imgUser.likedDevices,
      likeCount: imgUser.likeCount
    });
  }

  async toggleSmile(imgUser: ImgUser) {
    imgUser.reactedDevices = imgUser.reactedDevices || [];
    const hasAlreadyReacted = imgUser.reactedDevices.includes(this.deviceId);

    if (!hasAlreadyReacted) {
      imgUser.reactedDevices.push(this.deviceId);
      imgUser.smileCount = (imgUser.smileCount || 0) + 1;
    } else {
      imgUser.reactedDevices = imgUser.reactedDevices.filter(id => id !== this.deviceId);
      imgUser.smileCount = (imgUser.smileCount || 0) - 1;
    }

    await this.firebaseService.updateImgUserInGato(this.gato.id, imgUser.url, { 
      reactedDevices: imgUser.reactedDevices,
      smileCount: imgUser.smileCount
    });
  }  
}
