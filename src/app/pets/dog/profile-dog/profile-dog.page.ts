import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImgModalPage } from 'src/app/img-modal/img-modal.page';
import { Dog } from 'src/app/interface/Dog.models';

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

  perro: Dog[] = [{
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
  // temperamentoChips: Temperamento[] = [];



  infoPerro: any = (this.perro as any).default;

  constructor(
    private modalController: ModalController,
  ) {
    this.changeCardContent(this.selectedSegmentValue);
  }

  ngOnInit() {
    const perro = history.state.data;
    console.log(perro)
    this.infoName = perro.Raza;
    this.infoOrigin = perro.origen;
    this.infoImage = perro.imgPerfil;
    this.infoHistory = perro.historia;
    this.changeCardContent(this.selectedSegmentValue);
    this.perro = [perro];
  }

  getImagesArray(perro: Dog): string[] {
    const imagesArray: string[] = [];
    for (const key in perro.Img) {
      if (perro.Img.hasOwnProperty(key)) {
        imagesArray.push(perro.Img[key]);
      }
    }
    console.log(imagesArray);
    return Object.values(perro.Img);
  }

  // getPerroById(id: number): Dog[] {
  //   return this.infoPerro.filter((perro: Dog) => perro.id === id);
  // }

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
        // this.temperamentoChips = [];
        this.showImagesContainer = false;
        break;
      case 'temperamento':
        this.cardHeading = 'Temperamento';
        this.cardSubtitle = '';
        this.cardContent = perro.Temperamento.map((temp: { descripcion: any; }) => `<p>${temp.descripcion}</p>`).join('<hr class="my-3">');
        // this.temperamentoChips = this.getTemperamentoChips(perro.Temperamento);
        this.showImagesContainer = false;
        break;
      case 'cuidado':
        this.cardHeading = 'Cuidado y Salud';
        this.cardSubtitle = perro.Raza;
        this.cardContent = Object.keys(perro.cuidados).map(key => `<p><span class="font-bold">${key}:</span> ${perro.cuidados[key]}</p>`).join('<hr class="my-3">');
        // this.temperamentoChips = [];
        this.showImagesContainer = false;
        break;
      case 'images':
        this.cardHeading = 'Imágenes';
        this.cardSubtitle = perro.Raza;
        this.cardContent = '';
        // this.temperamentoChips = [];
        this.showImagesContainer = true;
        break;
      default:
        this.selectedSegmentValue = 'caracteristicas';
        this.cardHeading = 'Características Físicas';
        this.cardSubtitle = perro.Raza;
        // this.temperamentoChips = [];
        this.showImagesContainer = false;
        break;
    }
  }


  // getTemperamentoChips(temperamento: Temperamento[]): Temperamento[] {
  //   return temperamento.filter(item => item.aplicable);
  // }

  getNameRaza(raza: Dog[]): Dog[] {
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

  // async openModalSwiper(perro: InfoPerro) {
  //   const modal = await this.modalController.create({
  //     component: ModalSwiperPage,
  //     componentProps: {
  //       images: this.getImagesArray(perro),
  //       initialSlide: 0
  //     }
  //   });
  //   return await modal.present();
  // }
}
