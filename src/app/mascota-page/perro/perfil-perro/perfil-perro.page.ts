import { Component, OnInit } from '@angular/core';
import { ImgModalPage } from '../../../components/img-modal/img-modal.page';
import { ModalController } from '@ionic/angular';
import { InfoPerro, Temperamento } from '../../../interface/InfoPerro.models';
import { ModalSwiperPage } from 'src/app/components/modal-swiper/modal-swiper.page';
import { AdmobAds, BannerPosition, BannerSize, } from 'capacitor-admob-ads';

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

  perro: InfoPerro[] = [{
    Img: { img1: 'url1', img2: 'url2', img3: 'url3' },
    origen: '',
    fechaCreacion: undefined,
    Longevidad: '',
    Temperamento: [],
    Año: '',
    historia: '',
    CaractFisicas: undefined,
    id: 0,
    Raza: '',
    imgPerfil: '',
    cuidados: undefined
  }];
  selectedPerroId!: number;
  showImagesContainer: boolean = false;
  temperamentoChips: Temperamento[] = [];



  infoPerro: any = (this.perro as any).default;

  constructor(
    private modalController: ModalController,
  ) {
    this.changeCardContent(this.selectedSegmentValue);
  }


  ionViewDidEnter() {
    this.showAdaptiveBanner();
  }

  ngOnInit() {
    const perro = history.state.data;
    this.infoName = perro.Raza;
    this.infoOrigin = perro.origen;
    this.infoImage = perro.imgPerfil;
    this.infoHistory = perro.historia;
    this.changeCardContent(this.selectedSegmentValue);
    this.perro = [perro];
  }

  getImagesArray(perro: InfoPerro): string[] {
    const imagesArray: string[] = [];
    for (const key in perro.Img) {
      if (perro.Img.hasOwnProperty(key)) {
        imagesArray.push(perro.Img[key]);
      }
    }
    return Object.values(perro.Img);
  }

  getPerroById(id: number): InfoPerro[] {
    return this.infoPerro.filter((perro: InfoPerro) => perro.id === id);
  }

  changeCardContent(segmentValue: string) {
    const perro = history.state.data;
    if (!perro) {
      return;
    }
    switch (segmentValue) {
      case 'caracteristicas':
        this.cardHeading = 'Características Físicas';
        this.cardSubtitle = perro.Raza;
        this.cardContent = Object.keys(perro.CaractFisicas).map(key => `<p><span class="font-bold">${key}:</span> ${perro.CaractFisicas[key]}</p>`).join('<hr class="my-3">');
        this.temperamentoChips = [];
        this.showImagesContainer = false;
        break;
      case 'temperamento':
        this.cardHeading = 'Temperamento';
        this.cardSubtitle = '';
        this.cardContent = perro.Temperamento.map((temp: { descripcion: any; }) => `<p>${temp.descripcion}</p>`).join('<hr class="my-3">');
        this.temperamentoChips = this.getTemperamentoChips(perro.Temperamento);
        this.showImagesContainer = false;
        break;
      case 'cuidado':
        this.cardHeading = 'Cuidado y Salud';
        this.cardSubtitle = perro.Raza;
        this.cardContent = Object.keys(perro.cuidados).map(key => `<p><span class="font-bold">${key}:</span> ${perro.cuidados[key]}</p>`).join('<hr class="my-3">');
        this.temperamentoChips = [];
        this.showImagesContainer = false;
        break;
      case 'images':
        this.cardHeading = 'Imágenes';
        this.cardSubtitle = perro.Raza;
        this.cardContent = '';
        this.temperamentoChips = [];
        this.showImagesContainer = true;
        break;
      default:
        this.selectedSegmentValue = 'caracteristicas';
        this.cardHeading = 'Características Físicas';
        this.cardSubtitle = perro.Raza;
        this.temperamentoChips = [];
        this.showImagesContainer = false;
        break;
    }
  }


  getTemperamentoChips(temperamento: Temperamento[]): Temperamento[] {
    return temperamento.filter(item => item.aplicable);
  }

  getNameRaza(raza: InfoPerro[]): InfoPerro[] {
    return raza.filter(item => item.Raza)
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

  async openModalSwiper(perro: InfoPerro) {
    const modal = await this.modalController.create({
      component: ModalSwiperPage,
      componentProps: {
        images: this.getImagesArray(perro),
        initialSlide: 0
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
