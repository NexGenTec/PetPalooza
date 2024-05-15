import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImgModalPage } from '../img-modal/img-modal.page';
import { ModalController } from '@ionic/angular';
import { InfoPerro, Temperamento } from '../interface/InfoPerro.models';
import { FirestoreService } from '../service/firestore.service';

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

  perro: InfoPerro[] = [];
  selectedPerroId!: number;
  showImagesContainer: boolean = false;
  temperamentoChips: Temperamento[] = [];

  infoPerro: any = (this.perro as any).default;

  constructor(private route: ActivatedRoute, private modalController: ModalController,
    private firestores: FirestoreService,
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

  getImagesArray(perro: InfoPerro): string[] {
    const imagesArray: string[] = [];
    for (const key in perro.Img) {
      if (perro.Img.hasOwnProperty(key)) {
        imagesArray.push(perro.Img[key]);
      }
    }
    console.log(imagesArray);
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

}
