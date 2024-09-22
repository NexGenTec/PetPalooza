import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImgModalPage } from 'src/app/components/img-modal/img-modal.page';
import { InfoGato, Temperamento, Cuidado, CaracteristicasFisicas } from 'src/app/interface/InfoGato.models';
import { ModalSwiperPage } from 'src/app/components/modal-swiper/modal-swiper.page';

@Component({
  selector: 'app-profile-cat',
  templateUrl: './profile-cat.page.html',
  styleUrls: ['./profile-cat.page.scss'],
})
export class ProfileCatPage implements OnInit {

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

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.gato = history.state.data;
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
}
