import { Component, OnInit } from '@angular/core';
import * as infoPerro from '../../assets/data/InfoPerro.json';
import { CuidadosYSalud, Dog, Temperamento } from '../interface/perro';
import { ActivatedRoute } from '@angular/router';
import { ImgModalPage } from '../img-modal/img-modal.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-perfil-perro',
  templateUrl: './perfil-perro.page.html',
  styleUrls: ['./perfil-perro.page.scss'],
})
export class PerfilPerroPage implements OnInit {
  selectedSegmentValue: string = 'origen';
  cardHeading: string = '';
  cardSubtitle: string = '';
  cardContent: string = '';

  Perro: Dog[] = [];
  selectedPerroId!: number;
  temperamentoChips: Temperamento[] = [];

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
        this.cardSubtitle = selectedPerro.Raza;
        this.cardContent = this.infoPerro[0]['Origen e Historia'];
        this.temperamentoChips = [];
        break;
      case 'caracteristicas':
        this.cardHeading = 'Características Físicas';
        this.cardSubtitle = selectedPerro.Raza;
        this.cardContent = this.formatCaracteristicas(selectedPerro['Características Físicas']);
        this.temperamentoChips = [];
        break;
      case 'temperamento':
        this.cardHeading = 'Temperamento';
        this.cardSubtitle = selectedPerro.Raza;
        this.cardContent = this.formatTemperamento(selectedPerro.Temperamento);
        this.temperamentoChips = this.getTemperamentoChips(selectedPerro.Temperamento);
        break;
      case 'cuidado':
        this.cardHeading = 'Cuidado y Salud';
        this.cardSubtitle = selectedPerro.Raza;
        this.cardContent = this.formatCuidado(selectedPerro['Cuidados y Salud'] as CuidadosYSalud);
        this.temperamentoChips = [];
        break;
      default:
        this.selectedSegmentValue = 'origen';
        this.cardHeading = 'Origen';
        this.cardSubtitle = selectedPerro.Raza;
        this.cardContent = this.infoPerro[0]['Origen e Historia'];
        this.temperamentoChips = [];
        break;
    }
  }



  formatCaracteristicas(caracteristicas: any): string {
    let formatted = '<div>';
    for (const key in caracteristicas) {
      if (caracteristicas.hasOwnProperty(key)) {
        formatted += `<p><strong>${key}:</strong> ${caracteristicas[key]}</p>`;
      }
    }
    formatted += '</div>';
    return formatted;
  }

  formatTemperamento(temperamento: any): string {
    let formatted = '<div>';
    if (Array.isArray(temperamento)) {
      temperamento.forEach((item: any) => {
        if (item.aplicable) {
          formatted += `<p><strong>${item.tipo}:</strong> ${item.descripcion}</p>`;
        }
      });
    } else {
      for (const key in temperamento) {
        if (temperamento.hasOwnProperty(key)) {
          const item = temperamento[key];
          if (item.aplicable) {
            formatted += `<p><strong>${key}:</strong> ${item.descripcion}</p>`;
          }
        }
      }
    }
    formatted += '</div>';
    return formatted;
  }



  formatCuidado(cuidado: any): string {
    let formatted = '<div>';
    for (const key in cuidado) {
      if (cuidado.hasOwnProperty(key)) {
        if (Array.isArray(cuidado[key])) {
          formatted += `<p><strong>${key}:</strong> <div>`;
          cuidado[key].forEach((item: string) => { // Specify the type of 'item'
            formatted += `<p>${item}</p>`;
          });
          formatted += '</div></p>';
        } else {
          formatted += `<p><strong>${key}:</strong> ${cuidado[key]}</p>`;
        }
      }
    }
    formatted += '</div>';
    return formatted;
  }


  getTemperamentoChips(temperamento: Temperamento[]): Temperamento[] {
    return temperamento.filter(item => item.aplicable);
  }

  getNameRaza(raza : Dog[]): Dog[]{
    return raza.filter(item => item.Raza)
  }


  getChipColor(tipo: string): string {
    switch (tipo.toLowerCase()) {
      case 'valiente':
        return 'secondary';
      case 'inteligente':
        return 'secondary';
      case 'afectuoso':
        return 'secondary';
      case 'energético':
        return 'secondary';
      case 'alerta':
        return 'secondary';
      default:
        return 'secondary';
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
