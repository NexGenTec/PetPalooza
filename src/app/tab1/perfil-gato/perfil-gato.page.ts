import { Component, OnInit } from '@angular/core';
import * as infoGato from '../../../assets/data/InfoGato.json';

@Component({
  selector: 'app-perfil-gato',
  templateUrl: './perfil-gato.page.html',
  styleUrls: ['./perfil-gato.page.scss'],
})
export class PerfilGatoPage implements OnInit {
  infoGato: any = (infoGato as any).default;

  selectedSegmentValue: string = 'origen';
  cardHeading: string = 'Origen';
  cardContent: string = 'Contenido de la tarjeta para el segmento "Origen"';

  constructor() { }


  ngOnInit() {
  }

  changeCardContent(segmentValue: string) {
    switch (segmentValue) {
      case 'origen':
        this.cardHeading = 'Origen';
        this.cardContent = this.infoGato[0]['Origen e Historia'];
        break;
      case 'caracteristicas':
        this.cardHeading = 'Características Físicas';
        this.cardContent = JSON.stringify(this.infoGato[0]['Características Físicas']);
        break;
      case 'temperamento':
        this.cardHeading = 'Temperamento';
        this.cardContent = JSON.stringify(this.infoGato[0].Temperamento);
        break;
      case 'cuidado':
        this.cardHeading = 'Cuidado y Salud';
        this.cardContent = JSON.stringify(this.infoGato[0]['Cuidados y Salud']);
        break;
      default:
        break;
    }
  }


}
