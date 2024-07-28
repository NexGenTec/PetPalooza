import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImgModalPage } from 'src/app/img-modal/img-modal.page';
import { InfoPerro, Temperamento } from '../../../interface/InfoPerro.models';
import { ModalSwiperPage } from 'src/app/modal-swiper/modal-swiper.page';

@Component({
  selector: 'app-profile-dog',
  templateUrl: './profile-dog.page.html',
  styleUrls: ['./profile-dog.page.scss'],
})
export class ProfileDogPage implements OnInit {
  selectedSegmentValue: string = 'caracteristicas';
  cardHeading: string = '';
  cardSubtitle: string = '';
  cardContent: string = '';

  infoName!: string;
  infoImage!: string;
  infoOrigin!: string;
  infoHistory!: string;

  perro: InfoPerro[] = [{
    Img: [],
    Origen: '',
    fechaCreacion: undefined,
    Longevidad: '',
    Temperamento: [],
    Anio: '',
    Historia: '',
    caracteristicasFisicas: [],
    id: '',
    Raza: '',
    imgPerfil: '',
    Cuidados: []
  }];
  selectedPerroId!: number;
  showImagesContainer: boolean = false;
  temperamentoChips: Temperamento[] = [];

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    const perro = history.state.data;
    if (perro) {
      this.infoName = perro.Raza;
      this.infoOrigin = perro.Origen;
      this.infoImage = perro.imgPerfil;
      this.infoHistory = perro.Historia;
      this.changeCardContent(this.selectedSegmentValue);
      this.perro = [perro];
    }
  }

  getImagesArray(perro: InfoPerro): string[] {
    return Object.values(perro.Img);
  }

  changeCardContent(segmentValue: string) {
    const perro = history.state.data;
    if (!perro) return;

    switch (segmentValue) {
      case 'caracteristicas':
        this.setCardContent('Características Físicas', perro.Raza, this.formatCharacteristics(perro.caracteristicasFisicas));
        this.temperamentoChips = [];
        this.showImagesContainer = false;
        break;
      case 'temperamento':
        this.setCardContent('Temperamento', '', this.formatTemperamento(perro.Temperamento));
        this.temperamentoChips = this.getTemperamentoChips(perro.Temperamento);
        this.showImagesContainer = false;
        break;
      case 'cuidado':
        this.setCardContent('Cuidado y Salud', perro.Raza, this.formatCuidado(perro.Cuidados));
        this.temperamentoChips = [];
        this.showImagesContainer = false;
        break;
      case 'images':
        this.setCardContent('Imágenes', perro.Raza, '');
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

  formatCharacteristics(characteristics: any[]): string {
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

  formatCuidado(cuidados: any[]): string {
    return cuidados
      .map(item => `<p><span class="font-bold">${item.tipo}:</span> ${item.descripcion}</p>`)
      .join('<hr class="my-3">');
  }

  getTemperamentoChips(temperamento: Temperamento[]): Temperamento[] {
    return temperamento.filter(item => item.tipo);
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
}
