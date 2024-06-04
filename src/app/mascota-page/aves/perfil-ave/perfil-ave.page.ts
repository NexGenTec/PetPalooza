import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ImgModalPage } from 'src/app/components/img-modal/img-modal.page';
import { InfoAve, Temperamento } from 'src/app/interface/InfoAve.models';
import { FirestoreService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-perfil-ave',
  templateUrl: './perfil-ave.page.html',
  styleUrls: ['./perfil-ave.page.scss'],
})
export class PerfilAvePage implements OnInit {
  selectedSegmentValue: string = 'caracteristicas';
  cardHeading: string = '';
  cardSubtitle: string = '';
  cardContent: string = '';
  infoName!: string;
  infoImage!: string;
  infoOrigin!: string;
  infoHistory!: string;

  ave: InfoAve[] = [];
  selectedPerroId!: number;
  showImagesContainer: boolean = false;
  infoAve: any = (this.ave as any).default;
  temperamentoChips: Temperamento[] = [];

  constructor(private route: ActivatedRoute,
    private modalController: ModalController,
    private firestores: FirestoreService,
  ) {
    this.changeCardContent(this.selectedSegmentValue);
  }
  ngOnInit() {
    const ave = history.state.data;
    console.log(ave)
    this.infoName = ave.Raza;
    this.infoOrigin = ave.origen;
    this.infoImage = ave.imgPerfil;
    this.infoHistory = ave.historia;
    this.changeCardContent(this.selectedSegmentValue);
    this.ave = [ave];
  }

  getImagesArray(ave: InfoAve): string[] {
    const imagesArray: string[] = [];
    for (const key in ave.img) {
      if (ave.img.hasOwnProperty(key)) {
        imagesArray.push(ave.img[key]);
      }
    }
    console.log(imagesArray);
    return Object.values(ave.img);
  }

  getPerroById(id: number): InfoAve[] {
    return this.ave.filter((ave: InfoAve) => ave.id === id);
  }

  changeCardContent(segmentValue: string) {
    const ave = history.state.data;
    if (!ave) {
      return;
    }
    switch (segmentValue) {
      case 'caracteristicas':
        this.cardHeading = 'Características Físicas';
        this.cardSubtitle = ave.Raza;
        this.cardContent = Object.keys(ave.CaractFisicas).map(key => `<p><span class="font-bold">${key}:</span> ${ave.CaractFisicas[key]}</p>`).join('<hr class="my-3">');
        this.temperamentoChips = [];
        this.showImagesContainer = false;
        break;
      case 'temperamento':
        this.cardHeading = 'Temperamento';
        this.cardSubtitle = '';
        /* this.cardContent = gato.Temperamento.map((temp: { descripcion: any; }) => `<p>${temp.descripcion}</p>`).join('<hr class="my-3">'); */
        this.cardContent = ave.Temperamento
          .filter(temp => temp.descripcion !== '')
          .map(temp => `<p>${temp.descripcion}</p>`)
          .join('<hr class="my-3">');

        this.temperamentoChips = this.getTemperamentoChips(ave.Temperamento);
        this.showImagesContainer = false;
        break;
      case 'cuidado':
        this.cardHeading = 'Cuidado y Salud';
        this.cardSubtitle = ave.Raza;
        this.cardContent = Object.keys(ave.cuidados).map(key => `<p><span class="font-bold">${key}:</span> ${ave.cuidados[key]}</p>`).join('<hr class="my-3">');
        this.temperamentoChips = [];
        this.showImagesContainer = false;
        break;
      case 'images':
        this.cardHeading = 'Imágenes';
        this.cardSubtitle = ave.Raza;
        this.cardContent = '';
        this.temperamentoChips = [];
        this.showImagesContainer = true;
        break;
      default:
        this.selectedSegmentValue = 'caracteristicas';
        this.cardHeading = 'Características Físicas';
        this.cardSubtitle = ave.Raza;
        this.temperamentoChips = [];
        this.showImagesContainer = false;
        break;
    }
  }

  getTemperamentoChips(temperamento: Temperamento[]): Temperamento[] {
    return temperamento.filter(item => item.aplicable);
  }

  getNameRaza(raza: InfoAve[]): InfoAve[] {
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

