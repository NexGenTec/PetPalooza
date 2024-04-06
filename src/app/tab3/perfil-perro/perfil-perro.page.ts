import { Component, OnInit } from '@angular/core';
import * as infoPerro from '../../../assets/data/InfoPerro.json';
import { Dog } from '../../interface/perro';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfil-perro',
  templateUrl: './perfil-perro.page.html',
  styleUrls: ['./perfil-perro.page.scss'],
})
export class PerfilPerroPage implements OnInit {

  Perro: Dog[] = [];
  selectedPerroId!: number;

  infoPerro: any = (infoPerro as any).default;

  selectedSegmentValue: string = 'origen';
  cardHeading: string = 'Origen';
  cardContent: string = 'Contenido de la tarjeta para el segmento "Origen"';

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.selectedSegmentValue = params['segment'];
      this.selectedPerroId = +params['perroId']; // Convert to number
      // Other initialization logic...
    });
  }

  getImagesArray(perro: Dog): string[] {
    // Convertir el objeto ImagenesPerro en un array de URLs de imágenes
    return Object.values(perro.img);
  }


  getPerroById(id: number): Dog[] {
    return this.infoPerro.filter((perro: Dog) => perro.id === id);
  }

  changeCardContent(segmentValue: string) {
    switch (segmentValue) {
      case 'origen':
        this.cardHeading = 'Origen';
        this.cardContent = this.infoPerro[0]['Origen e Historia'];
        break;
      case 'caracteristicas':
        this.cardHeading = 'Características Físicas';
        this.cardContent = JSON.stringify(this.infoPerro[0]['Características Físicas']);
        break;
      case 'temperamento':
        this.cardHeading = 'Temperamento';
        this.cardContent = JSON.stringify(this.infoPerro[0].Temperamento);
        break;
      case 'cuidado':
        this.cardHeading = 'Cuidado y Salud';
        this.cardContent = JSON.stringify(this.infoPerro[0]['Cuidados y Salud']);
        break;
      default:
        break;
    }
  }
}
