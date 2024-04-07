import { Component, OnInit } from '@angular/core';
import * as infoPerro from '../../../assets/data/InfoPerro.json';
import { CuidadosYSalud, Dog } from '../../interface/perro';
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
        this.cardContent = this.formatCaracteristicas(selectedPerro['Características Físicas']);
        break;
      case 'temperamento':
        this.cardHeading = 'Temperamento';
        this.cardContent = this.formatTemperamento(selectedPerro.Temperamento);
        break;
      case 'cuidado':
        this.cardHeading = 'Cuidado y Salud';
        this.cardContent = this.formatCuidado(selectedPerro['Cuidados y Salud'] as CuidadosYSalud);
        break;
      default:
        this.selectedSegmentValue = 'origen';
        this.cardHeading = 'Origen';
        this.cardContent = this.infoPerro[0]['Origen e Historia'];
        break;
    }
  }


  formatCaracteristicas(caracteristicas: any): string {
    let formatted = '<ul>';
    for (const key in caracteristicas) {
      if (caracteristicas.hasOwnProperty(key)) {
        formatted += `<li><strong>${key}:</strong> ${caracteristicas[key]}</li>`;
      }
    }
    formatted += '</ul>';
    return formatted;
  }

  formatTemperamento(temperamento: any): string {
    let formatted = '<ul>';
    for (const key in temperamento) {
      if (temperamento.hasOwnProperty(key) && temperamento[key]) {
        formatted += `<li>${key}</li>`;
      }
    }
    formatted += '</ul>';
    return formatted;
  }

  formatCuidado(cuidado: any): string {
    let formatted = '<ul>';
    for (const key in cuidado) {
      if (cuidado.hasOwnProperty(key)) {
        if (Array.isArray(cuidado[key])) {
          formatted += `<li><strong>${key}:</strong> <ul>`;
          cuidado[key].forEach((item: string) => { // Specify the type of 'item'
            formatted += `<li>${item}</li>`;
          });
          formatted += '</ul></li>';
        } else {
          formatted += `<li><strong>${key}:</strong> ${cuidado[key]}</li>`;
        }
      }
    }
    formatted += '</ul>';
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
