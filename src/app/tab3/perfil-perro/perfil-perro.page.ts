import { Component, OnInit } from '@angular/core';
import * as infoPerro from '../../../assets/data/InfoPerro.json';
import { Dog } from '../../interface/perro';
import { ActivatedRoute } from '@angular/router';
import { ImgModalPage } from '../../img-modal/img-modal.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-perfil-perro',
  templateUrl: './perfil-perro.page.html',
  styleUrls: ['./perfil-perro.page.scss'],
})
export class PerfilPerroPage implements OnInit {

  selectedSegmentValue: string = 'origen';
  cardHeading: string = '';
  cardContent: string = '';

  Perro: Dog[] = [];
  selectedPerroId!: number;

  infoPerro: any = (infoPerro as any).default;

  constructor(private route: ActivatedRoute, private modalController: ModalController) {
    this.changeCardContent(this.selectedSegmentValue);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.selectedSegmentValue = params['segment'];
      this.selectedPerroId = +params['id'];
      this.Perro = this.getPerroById(this.selectedPerroId);
      if (this.Perro.length > 0) {
        this.changeCardContent(this.selectedSegmentValue);
      }
    });
  }

  getImagesArray(perro: Dog): string[] {
    return Object.values(perro.img);
  }

  getPerroById(id: number): Dog[] {
    return this.infoPerro.filter((perro: Dog) => perro.id === id);
  }

  changeCardContent(segmentValue: string) {
    const selectedPerro = this.Perro[0];
    if (!selectedPerro) {
      console.error('No se encontró el perro seleccionado.');
      return;
    }
    switch (segmentValue) {
      case 'origen':
        this.cardHeading = 'Origen';
        this.cardContent = this.infoPerro[0]['Origen e Historia'];
        break;
      case 'caracteristicas':
        this.cardHeading = 'Características Físicas';
        this.cardContent = JSON.stringify(selectedPerro['Características Físicas']);
        break;
      case 'temperamento':
        this.cardHeading = 'Temperamento';
        this.cardContent = JSON.stringify(selectedPerro.Temperamento);
        break;
      case 'cuidado':
        this.cardHeading = 'Cuidado y Salud';
        this.cardContent = JSON.stringify(selectedPerro['Cuidados y Salud']);
        break;
      default:
        this.selectedSegmentValue = 'origen'
        this.cardHeading = 'Origen';
        this.cardContent = this.infoPerro[0]['Origen e Historia'];
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
