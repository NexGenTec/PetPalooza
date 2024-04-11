import { Component, OnInit } from '@angular/core';
import * as infoGato from '../../assets/data/InfoGato.json';
import { ActivatedRoute } from '@angular/router';
import { Cat } from '../interface/gato';
import { ModalController } from '@ionic/angular';
import { ImgModalPage } from '../img-modal/img-modal.page';

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
        this.cardContent = this.formatCaracteristicas(selectedGato['Características Físicas']);
        break;
      case 'temperamento':
        this.cardHeading = 'Temperamento';
        this.cardContent = this.formatTemperamento(selectedGato.Temperamento);
        break;
      case 'cuidado':
        this.cardHeading = 'Cuidado y Salud';
        this.cardContent = this.formatCuidado(selectedGato['Cuidados y Salud']);
        break;
      default:
        this.selectedSegmentValue = 'origen'
        this.cardHeading = 'Origen';
        this.cardContent = this.infoGato[0]['Origen e Historia'];
        break;
    }
  }

  formatCaracteristicas(caracteristicas: any): string {
    let formatted = '';
    for (const key in caracteristicas) {
      if (caracteristicas.hasOwnProperty(key)) {
        formatted += `<strong>${key}:</strong> ${caracteristicas[key]}<br>`;
      }
    }
    return formatted;
  }

  formatTemperamento(temperamento: any): string {
    let formatted = '';
    for (const key in temperamento) {
      if (temperamento.hasOwnProperty(key) && temperamento[key]) {
        formatted += `${key}, `;
      }
    }
    formatted = formatted.slice(0, -2);
    return formatted;
  }

  formatCuidado(cuidado: any): string {
    let formatted = '';
    for (const key in cuidado) {
      if (cuidado.hasOwnProperty(key)) {
        formatted += `<strong>${key}:</strong> ${cuidado[key]}<br>`;
      }
    }
    return formatted;
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
