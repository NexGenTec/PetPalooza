import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../service/firestore.service';
import { CuidadosGeneral } from '../interface/CuidadosGeneral.model';

@Component({
  selector: 'app-cuidados',
  templateUrl: './cuidados.page.html',
  styleUrls: ['./cuidados.page.scss'],
})
export class CuidadosPage implements OnInit {
  CuidadosGeneral: CuidadosGeneral[] = [];
  selectedSegment: string = 'Controles';
  cardHeading: string = '';
  cardSubtitle: string = '';
  cardContent: string = '';

  constructor(private firestoreService: FirestoreService) { }

  ngOnInit() {
    this.getCuidadosGenerales();
  }

  getCuidadosGenerales() {
    this.firestoreService.getCollectionChanges<CuidadosGeneral>('CuidadosGeneral').subscribe(data => {
      if (data) {
        this.CuidadosGeneral = data;
        console.log(this.CuidadosGeneral);
        this.changeCardContent(this.selectedSegment);
      }
    });
  }

  changeCardContent(segmentValue: string) {
    const selectedData = this.CuidadosGeneral.find(item => item.tituloSeg === segmentValue);
    console.log(this.selectedSegment);
    if (selectedData) {
      console.log(selectedData);
      this.cardHeading = selectedData.tituloSeg;
      this.cardSubtitle = ''
      switch (segmentValue) {
        case 'Controles':
          this.cardContent = this.getControlesChequeos(selectedData);
          break;
        case 'Enfermedades':
          this.cardContent = this.getEnfermedades(selectedData);
          break;
        case 'Dieta':
          this.cardContent = this.getDietaAlimentacion(selectedData);
          break;
        default:
          this.cardContent = ''; // Manejar el caso por defecto si es necesario
          break;
      }
    } else {
      this.cardHeading = '';
      this.cardSubtitle = '';
      this.cardContent = '';
    }
  }

  // Método para obtener el contenido HTML de Controles y Chequeos Regulares
  getControlesChequeos(data: any): string {
    const controles = data['Controles y Chequeos Regulares'];
    let htmlContent = '';

    if (controles && controles.length > 0) {
      htmlContent = `<p>${data.descripcion}</p><hr class="my-3">`; // Agregar descripción general

      // Agregar cada control y chequeo como lista de puntos
      controles.forEach(control => {
        htmlContent += `<p><span class="font-bold">Tipo:</span> ${control.tipo}</p>`;
        htmlContent += `<p><span class="font-bold">Primero:</span> ${control.primero}</p>`;
        htmlContent += `<p><span class="font-bold">Segundo:</span> ${control.segundo}</p>`;
        htmlContent += `<p><span class="font-bold">Tercero:</span> ${control.tercero}</p>`;
        if (control.cuarto) {
          htmlContent += `<p><span class="font-bold">Cuarto:</span> ${control.cuarto}</p>`;
        }
        if (control.quinto) {
          htmlContent += `<p><span class="font-bold">Quinto:</span> ${control.quinto}</p>`;
        }
        htmlContent += `<hr class="my-3">`;
      });
    }

    return htmlContent;
  }

  getEnfermedades(data: any): string {
    const enfermedadesGato = data.comunGato;
    const enfermedadesPerro = data.comunPerro;
    let htmlContent = '';

    if (enfermedadesGato || enfermedadesPerro) {
      htmlContent = `<p>${data.descripcion}</p><hr class="my-3">`; // Agregar descripción general

      // Agregar enfermedades de gatos
      if (enfermedadesGato) {
        htmlContent += `<h4>Enfermedades Comunes en Gatos:</h4>`;
        Object.keys(enfermedadesGato).forEach(enfermedad => {
          htmlContent += `<p><span class="font-bold">${enfermedad}:</span> ${enfermedadesGato[enfermedad]}</p>`;
        });
        htmlContent += `<hr class="my-3">`;
      }

      // Agregar enfermedades de perros
      if (enfermedadesPerro) {
        htmlContent += `<h4>Enfermedades Comunes en Perros:</h4>`;
        Object.keys(enfermedadesPerro).forEach(enfermedad => {
          htmlContent += `<p><span class="font-bold">${enfermedad}:</span> ${enfermedadesPerro[enfermedad]}</p>`;
        });
        htmlContent += `<hr class="my-3">`;
      }
    } else {
      htmlContent = `<p>No se encontraron datos de Enfermedades.</p>`;
    }

    return htmlContent;
  }


  getDietaAlimentacion(data: any): string {
    const dietaGato = data.alimentoGato;
    const dietaPerro = data.alimentoPerro;
    let htmlContent = '';

    if (dietaGato || dietaPerro) {
      htmlContent = `<p>${data.descripcion}</p><hr class="my-3">`; // Agregar descripción general

      // Agregar dieta de gatos
      if (dietaGato) {
        htmlContent += `<h4>Dieta BARF para Gatos:</h4>`;
        Object.keys(dietaGato).forEach(key => {
          htmlContent += `<p><span class="font-bold">${key}:</span> ${dietaGato[key]}</p>`;
        });
        htmlContent += `<hr class="my-3">`;
      }

      // Agregar dieta de perros
      if (dietaPerro) {
        htmlContent += `<h4>Dieta BARF para Perros:</h4>`;
        Object.keys(dietaPerro).forEach(key => {
          htmlContent += `<p><span class="font-bold">${key}:</span> ${dietaPerro[key]}</p>`;
        });
        htmlContent += `<hr class="my-3">`;
      }
    } else {
      htmlContent = `<p>No se encontraron datos de Dieta y Alimentación.</p>`;
    }

    return htmlContent;
  }

}
