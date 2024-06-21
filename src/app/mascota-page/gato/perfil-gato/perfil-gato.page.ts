import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImgModalPage } from '../../../components/img-modal/img-modal.page';
import { InfoGato, Temperamento } from '../../../interface/InfoGato.models';
import { ModalSwiperPage } from 'src/app/components/modal-swiper/modal-swiper.page';

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

  gato: InfoGato[] = [];
  selectedPerroId!: number;
  showImagesContainer: boolean = false;
  temperamentoChips: Temperamento[] = [];

  infoGato: any = (this.gato as any).default;

  constructor(
    private modalController: ModalController,
  ) {
    this.changeCardContent(this.selectedSegmentValue);
  }
  ngOnInit() {
    const gato = history.state.data;
    console.log(gato)
    this.infoName = gato.Raza;
    this.infoOrigin = gato.origen;
    this.infoImage = gato.imgPerfil;
    this.infoHistory = gato.historia;
    this.changeCardContent(this.selectedSegmentValue);
    this.gato = [gato];
  }

  getImagesArray(gato: InfoGato): string[] {
    const imagesArray: string[] = [];
    for (const key in gato.img) {
      if (gato.img.hasOwnProperty(key)) {
        imagesArray.push(gato.img[key]);
      }
    }
    console.log(imagesArray);
    return Object.values(gato.img);
  }

  getPerroById(id: number): InfoGato[] {
    return this.infoGato.filter((gato: InfoGato) => gato.id === id);
  }

  changeCardContent(segmentValue: string) {
    const gato = history.state.data;
    if (!gato) {
      return;
    }
    switch (segmentValue) {
      case 'caracteristicas':
        this.cardHeading = 'Características Físicas';
        this.cardSubtitle = gato.Raza;
        this.cardContent = Object.keys(gato.CaractFisicas).map(key => `<p><span class="font-bold">${key}:</span> ${gato.CaractFisicas[key]}</p>`).join('<hr class="my-3">');
        this.temperamentoChips = [];
        this.showImagesContainer = false;
        break;
      case 'temperamento':
        this.cardHeading = 'Temperamento';
        this.cardSubtitle = '';
        this.cardContent = gato.Temperamento
          .filter(temp => temp.descripcion !== '')
          .map(temp => `<p>${temp.descripcion}</p>`)
          .join('<hr class="my-3">');

        this.temperamentoChips = this.getTemperamentoChips(gato.Temperamento);
        this.showImagesContainer = false;
        break;
      case 'cuidado':
        this.cardHeading = 'Cuidado y Salud';
        this.cardSubtitle = gato.Raza;
        this.cardContent = Object.keys(gato.cuidados).map(key => `<p><span class="font-bold">${key}:</span> ${gato.cuidados[key]}</p>`).join('<hr class="my-3">');

        this.temperamentoChips = [];
        this.showImagesContainer = false;
        break;
      case 'images':
        this.cardHeading = 'Imágenes';
        this.cardSubtitle = gato.Raza;
        this.cardContent = '';
        this.temperamentoChips = [];
        this.showImagesContainer = true;
        break;
      default:
        this.selectedSegmentValue = 'caracteristicas';
        this.cardHeading = 'Características Físicas';
        this.cardSubtitle = gato.Raza;
        this.temperamentoChips = [];
        this.showImagesContainer = false;
        break;
    }
  }

  getTemperamentoChips(temperamento: Temperamento[]): Temperamento[] {
    return temperamento.filter(item => item.aplicable);
  }

  getNameRaza(raza: InfoGato[]): InfoGato[] {
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

  async openModalSwiper(gato: InfoGato) {
    const modal = await this.modalController.create({
      component: ModalSwiperPage,
      componentProps: {
        images: this.getImagesArray(gato),
        initialSlide: 0
      }
    });
    return await modal.present();
  }
}
