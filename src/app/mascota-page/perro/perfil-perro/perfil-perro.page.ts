import { Component, OnInit } from '@angular/core';
import { ImgModalPage } from '../../../components/img-modal/img-modal.page';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { CaracteristicasFisicas, Cuidado, ImgUser, InfoPerro, Temperamento } from '../../../interface/InfoPerro.models';
import { ModalSwiperPage } from 'src/app/components/modal-swiper/modal-swiper.page';
import { ActivatedRoute, Router } from '@angular/router';
import { DataOflineService } from 'src/app/service/data-ofline.service';
import { ActionPerformed, PushNotifications } from '@capacitor/push-notifications';
import { AddImagePage } from '../add-image/add-image.page';
import { StorageService } from '../../../service/storage.service';
import { ModalswiperUsersPage } from 'src/app/components/modalswiper-users/modalswiper-users.page';
import { Share } from '@capacitor/share';
import { ReactionService } from 'src/app/service/reaction.service';
import { Device } from '@capacitor/device';
import { v4 as uuidv4 } from 'uuid';
import { InteractionService } from 'src/app/service/interaction.service';

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
  Longevidad!: string;

  favorites: any[] = [];

  perro!: InfoPerro;
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
    if (!this.perro) {
      console.error('No hay datos del perfil para compartir.');
      return;
    }
  
    const perfilId = this.perro.id;
    const truncatedHistory = this.truncateText(this.perro.Historia, 250);
    const shareTitle = `¡Conoce a ${this.perro.Raza}!`;
    const imageUrl = this.perro.imgPerfil; // URL pública de la imagen
    const shareText = `${tipo === 'perro' ? '🐱' : '🐶'} **${this.perro.Raza}**\n\n` +
                      `🌟 **Historia:** ${truncatedHistory}\n` +
                      `🌍 **Origen:** ${this.perro.Origen}\n\n` +
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
    return Array.isArray(perro?.Img) ? Object.values(perro.Img) : [];
  }

  getImageUsersArray(perro: InfoPerro): ImgUser[] {
    return Array.isArray(perro?.ImgUsers) ? perro.ImgUsers : [];
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
  async openModalSwiperUser(perro: InfoPerro, selectedImage: ImgUser) {
    try {
      // Obtén el array completo de imágenes para el swiper
      const images: ImgUser[] = this.getImageUsersArray(perro);

      // Encuentra el índice de la imagen seleccionada
      const initialSlideIndex = images.findIndex(img => img.url === selectedImage.url);

      // Crea el modal y pasa las imágenes y el índice inicial
      const modal = await this.modalController.create({
        component: ModalswiperUsersPage,
        componentProps: {
          images,
          initialSlide: initialSlideIndex // Configura el índice inicial al de la imagen seleccionada
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
      componentProps: { perroRaza: this.perro.Raza, perroId: this.perro.id }
    });
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
    this.interactionService.triggerLike(); 
    await this.favoritesService.addToFavorites(animal, type);
    this.loadFavorites();
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

    await this.firebaseService.updateImgUserInPerro(this.perro.id, imgUser.url, { 
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

    await this.firebaseService.updateImgUserInPerro(this.perro.id, imgUser.url, { 
      reactedDevices: imgUser.reactedDevices,
      smileCount: imgUser.smileCount
    });
  }  
}
