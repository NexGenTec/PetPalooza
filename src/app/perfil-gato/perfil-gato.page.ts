import { Component, OnInit } from '@angular/core';
import * as infoGato from '../../assets/data/InfoGato.json';
import { ActivatedRoute } from '@angular/router';
import { Cat, Temperamento } from '../interface/gato';
import { ModalController } from '@ionic/angular';
import { ImgModalPage } from '../img-modal/img-modal.page';

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

  infoName: string = '';
  infoOrigin: string = '';
  infoHistory: string = '';
  infoImage: string = '';

  Gato: Cat[] = [];
  selectedGatoId!: number;
  temperamentoChips: Temperamento[] = [];

  showImagesContainer: boolean = false;

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
      /* case 'origen':
        this.cardHeading = 'Origen';
        this.cardSubtitle = selectedGato.Raza;
        this.cardContent = this.formOrigen(selectedGato['Origen e Historia']);
        this.temperamentoChips = [];
        this.showImagesContainer = false;
        break; */
      case 'caracteristicas':
        this.cardHeading = 'Características Físicas';
        this.cardSubtitle = selectedGato.Raza;
        this.cardContent = this.formatCaracteristicas(selectedGato['Características Físicas']);
        this.temperamentoChips = [];
        this.showImagesContainer = false;
        break;
      case 'temperamento':
        this.cardHeading = 'Temperamento';
        this.cardSubtitle = selectedGato.Raza;
        this.cardContent = this.formatTemperamento(selectedGato.Temperamento);
        this.temperamentoChips = this.getTemperamentoChips(selectedGato.Temperamento);
        this.showImagesContainer = false;
        break;
      case 'cuidado':
        this.cardHeading = 'Cuidado y Salud';
        this.cardSubtitle = selectedGato.Raza;
        this.cardContent = this.formatCuidado(selectedGato['Cuidados y Salud']);
        this.temperamentoChips = [];
        this.showImagesContainer = false;
        break;

      case 'images':
        this.cardHeading = 'Imágenes';
        this.cardSubtitle = '';
        this.cardContent = '';
        this.temperamentoChips = [];
        this.showImagesContainer = true;
        break;

      default:
        this.selectedSegmentValue = 'caracteristicas';

        this.cardHeading = 'Características Físicas';
        this.cardSubtitle = selectedGato.Raza;
        this.cardContent = this.formatCaracteristicas(selectedGato['Características Físicas']);
        this.temperamentoChips = [];

        this.infoName = selectedGato.Raza;
        this.infoOrigin = selectedGato.Origen;
        this.infoImage = selectedGato.imgPerfil;
        this.infoHistory = selectedGato['Origen e Historia'];

        this.showImagesContainer = false;

        break;
    }
  }


  formOrigen(origen: any): string {
    let formatted = '';
    for (const key in origen) {
      if (origen.hasOwnProperty(key)) {
        formatted += `${origen[key]}`;
      }
    }
    return formatted;
  }

  formatCaracteristicas(caracteristicas: any): string {
    let formatted = '';
    for (const key in caracteristicas) {
      if (caracteristicas.hasOwnProperty(key)) {
        formatted += `<p><strong>${key}:</strong> ${caracteristicas[key]}</p><hr class='pb-2 mt-2'>`;
      }
    }
    return formatted;
  }

  formatTemperamento(temperamento: any): string {
    let formatted = '<div>';
    if (Array.isArray(temperamento)) {
      temperamento.forEach((item: any) => {
        if (item.aplicable) {
          formatted += `<p><strong>${item.tipo}:</strong> ${item.descripcion}</p><hr class='pb-2 mt-2'>`;
        }
      });
    } else {
      for (const key in temperamento) {
        if (temperamento.hasOwnProperty(key)) {
          const item = temperamento[key];
          if (item.aplicable) {
            formatted += `<li><strong>${key}:</strong> ${item.descripcion}</li><hr class='pb-2 mt-2'>`;
          }
        }
      }
    }
    formatted += '</div>';
    return formatted;
  }

  formatCuidado(cuidado: any): string {
    let formatted = '';
    for (const key in cuidado) {
      if (cuidado.hasOwnProperty(key)) {
        formatted += `<strong>${key}:</strong> ${cuidado[key]}<hr class='pb-2 mt-2'>`;
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

  getTemperamentoChips(temperamento: Temperamento[]): Temperamento[] {
    return temperamento.filter(item => item.aplicable);
  }

  getNameRaza(raza: Cat[]): Cat[] {
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
      // case 'amigable':
      //   return '--ion-color-light'; // azul
      // case 'tranquilo':
      //   return 'secondary'; // gris
      // case 'dulce':
      //   return 'tertiary'; // verde claro
      // case 'terco':
      //   return 'danger'; // rojo oscuro
      // case 'sociable':
      //   return 'success'; // verde
      // case 'afectuoso':
      //   return 'warning'; // amarillo
      // case 'juguetón':
      //   return 'info'; // azul claro
      // case 'adaptable':
      //   return 'dark'; // gris oscuro
      // case 'energético':
      //   return 'light'; // blanco
      // case 'valiente':
      //   return '--ion-color-light'; // azul
      // case 'alerta':
      //   return 'danger'; // rojo oscuro
      // case 'dócil':
      //   return 'success'; // verde
      // case 'amistoso':
      //   return '--ion-color-light'; // azul
      // case 'leal':
      //   return 'warning'; // amarillo
      // case 'inteligente':
      //   return '--ion-color-light'; // azul
      // default:
      // return 'medium'; // Color por defecto
    }
  }
}
