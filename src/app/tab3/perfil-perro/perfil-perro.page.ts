import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil-perro',
  templateUrl: './perfil-perro.page.html',
  styleUrls: ['./perfil-perro.page.scss'],
})
export class PerfilPerroPage implements OnInit {
  ngOnInit() {
  }

  selectedSegmentValue: string = 'origen';
  cardHeading: string = 'Origen';
  cardContent: string = 'Contenido de la tarjeta para el segmento "Origen"';

  constructor() { }

  changeCardContent(segmentValue: string) {
    switch (segmentValue) {
      case 'origen':
        this.cardHeading = 'Origen';
        this.cardContent = 'Contenido de la tarjeta para el segmento "Origen".';
        break;
      case 'caracteristicas':
        this.cardHeading = 'Caracteristicas Fisicas';
        this.cardContent = 'Contenido de la tarjeta para el segmento "Caracteristicas Fisicas".';
        break;
      case 'temperamento':
        this.cardHeading = 'Temperamento';
        this.cardContent = 'Contenido de la tarjeta para el segmento "Temperamento".';
        break;
      case 'cuidado':
        this.cardHeading = 'Cuidado y Salud';
        this.cardContent = 'Contenido de la tarjeta para el segmento "Cuidado y Salud".';
        break;
      default:
        break;
    }
  }

}
