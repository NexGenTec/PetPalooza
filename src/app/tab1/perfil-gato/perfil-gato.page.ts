import { Component, OnInit } from '@angular/core';
import * as infoGato from '../../../assets/data/InfoGato.json';
import { ActivatedRoute } from '@angular/router';
import { Cat } from '../../interface/gato';
import { ModalController } from '@ionic/angular';
import { ImgModalPage } from '../../img-modal/img-modal.page';

@Component({
  selector: 'app-perfil-gato',
  templateUrl: './perfil-gato.page.html',
  styleUrls: ['./perfil-gato.page.scss'],
})
export class PerfilGatoPage implements OnInit {

  selectedSegmentValue: string = 'origen';
  cardHeading: string = '';
  cardContent: string = '';

  Gato: Cat[] = [];
  selectedGatoId!: number;

  infoGato: any = (infoGato as any).default;
  constructor(private route: ActivatedRoute, private modalController: ModalController) {
    this.changeCardContent(this.selectedSegmentValue);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.selectedSegmentValue = params['segment'];
      this.selectedGatoId = +params['id'];
      this.Gato = this.getGatoById(this.selectedGatoId);
      if (this.Gato.length > 0) {
        this.changeCardContent(this.selectedSegmentValue);
      }
    });
  }
  getImagesArray(gato: Cat): string[] {
    return Object.values(gato.img);
  }

  getGatoById(id: number): Cat[] {
    return this.infoGato.filter((gato: Cat) => gato.id === id);
  }

  changeCardContent(segmentValue: string) {
    const selectedGato = this.Gato[0];
    if (!selectedGato) {
      console.error('No se encontró el gato seleccionado.');
      return;
    }
    switch (segmentValue) {
      case 'origen':
        this.cardHeading = 'Origen';
        this.cardContent = this.infoGato[0]['Origen e Historia'];
        break;
      case 'caracteristicas':
        this.cardHeading = 'Características Físicas';
        this.cardContent = JSON.stringify(selectedGato['Características Físicas']);
        break;
      case 'temperamento':
        this.cardHeading = 'Temperamento';
        this.cardContent = JSON.stringify(selectedGato.Temperamento);
        break;
      case 'cuidado':
        this.cardHeading = 'Cuidado y Salud';
        this.cardContent = JSON.stringify(selectedGato['Cuidados y Salud']);
        break;
      default:
        this.selectedSegmentValue = 'origen'
        this.cardHeading = 'Origen';
        this.cardContent = this.infoGato[0]['Origen e Historia'];
        break;
    }
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
