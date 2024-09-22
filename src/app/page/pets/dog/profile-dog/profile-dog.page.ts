import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImgModalPage } from 'src/app/components/img-modal/img-modal.page';
import { CaracteristicasFisicas, Cuidado, InfoPerro, Temperamento } from '../../../../interface/InfoPerro.models';
import { ModalSwiperPage } from 'src/app/components/modal-swiper/modal-swiper.page';

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

  perro!: InfoPerro;
  showImagesContainer: boolean = false;
  temperamentoChips: Temperamento[] = [];

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.perro = history.state.data;
    if (this.perro) {
      this.infoName = this.perro.Raza;
      this.infoOrigin = this.perro.Origen;
      this.infoImage = this.perro.imgPerfil;
      this.infoHistory = this.perro.Historia;
      this.changeCardContent(this.selectedSegmentValue);
    }
  }

  getImagesArray(perro: InfoPerro): string[] {
    return Object.values(perro.Img);
  }

  changeCardContent(segmentValue: string) {
    if (!this.perro) return;

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
}
