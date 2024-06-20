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
      htmlContent = `<p class="text-gray-500 text-sm my-3 mt-4 text-center">${data.descripcion}</p><hr class="my-3">`; // Agregar descripción general

      // Agregar cada control y chequeo como lista de puntos
      controles.forEach(control => {
        htmlContent += `<h4 class="text-base"><span class="text-base font-bold">${control.tipo}</span> en etapa <span class="text-base font-bold">${control.etapa}</span></h4>`
        htmlContent += `<details name="cachorros" open class=" my-3 border border-blue-100 border-spacing-1 rounded-xl p-2 px-3">`
        htmlContent += `<summary>¿Qué debo hacer? </summary>`
        htmlContent += `<p class="mt-3">- ${control.primero}</p>`;
        htmlContent += `<p><span class="font-bold">-</span> ${control.segundo}</p>`;
        htmlContent += `<p><span class="font-bold">-</span> ${control.tercero}</p>`;
        if (control.cuarto) {
          htmlContent += `<p><span class="font-bold">-</span> ${control.cuarto}</p>`;
        }
        if (control.quinto) {
          htmlContent += `<p><span class="font-bold">-</span> ${control.quinto}</p>`;
        }
        htmlContent += `</details>`

        // htmlContent += `<hr class="my-3">`
      });
    }

    return htmlContent;
  }

  getEnfermedades(data: any): string {
    const enfermedadesGato = data.comunGato;
    const enfermedadesPerro = data.comunPerro;
    let htmlContent = '';
    if (enfermedadesGato || enfermedadesPerro) {
      htmlContent = `<p class="text-gray-500 text-sm my-3 mt-4 text-center">${data.descripcion}</p><hr class="my-3">`; // Agregar descripción general
      // Agregar enfermedades de perros
      if (enfermedadesPerro) {
        htmlContent += `<h4 class="text-base">Enfermedades <b>Comunes en Perros:</b></h4>`;
        htmlContent += `<details class="my-3 border border-blue-100 border-spacing-1 rounded-xl p-2 px-3" open name="comun">`
        htmlContent += `<summary>¿Cuáles son?</summary>`
        Object.keys(enfermedadesPerro).forEach(enfermedad => {
          htmlContent += `<p class="mt-3"><span class="font-bold">${enfermedad}:</span> ${enfermedadesPerro[enfermedad]}</p>`;
        });
        htmlContent += `</details">`;
        htmlContent += `<hr class="my-3">`
      }
      if (enfermedadesGato) {
        htmlContent += `<h4 class="text-base">Enfermedades <b>Comunes en Gatos:</b></h4>`;
        htmlContent += `<details class="my-3" open name="comun">`
        htmlContent += `<summary>¿Cuáles son?</summary>`
        Object.keys(enfermedadesGato).forEach(enfermedad => {
          
          htmlContent += `<p class="mt-3"><span class="font-bold">${enfermedad}:</span> ${enfermedadesGato[enfermedad]}</p>`;
        });
        htmlContent += `</details>`;
      }
    } 
    
else {
      htmlContent = `<p>No se encontraron datos de Enfermedades.</p>`;
    }

    return htmlContent;
  }


  getDietaAlimentacion(data: any): string {
    const dietaGato = data.alimentoGato;
    const dietaPerro = data.alimentoPerro;
    const dietaBarf = data
    let htmlContent = '';

    if (dietaGato || dietaPerro || dietaBarf) {
      htmlContent = `<p class="text-gray-500 text-sm my-3 mt-4 text-center">${data.descripcion}</p><hr class="my-3">`; // Agregar descripción general
              // Agregar dieta de perros
      if (dietaPerro) {
        htmlContent += `<h4 class="text-base font-bold">La Dieta de Perros</h4>`;
          htmlContent += `<details class="my-3 border border-blue-100 border-spacing-1 rounded-xl p-2 px-3" open name="gato">`
        htmlContent += `<summary>¿Qué necesitan?</summary>`
        Object.keys(dietaPerro).forEach(key => {
          htmlContent += `<p class="mt-3"><span class="font-bold">${key}:</span> ${dietaPerro[key]}</p>`;
        });
        htmlContent += `</details>`
      }
      // Agregar dieta de gatos
      if (dietaGato) {
        htmlContent += `<h4 class="text-base font-bold">La Dieta de Gatos</h4>`;
        htmlContent += `<details class="my-3 border border-blue-100 border-spacing-1 rounded-xl p-2 px-3" open name="gato">`
        htmlContent += `<summary>¿Qué necesitan?</summary>`
        Object.keys(dietaGato).forEach(key => {
          htmlContent += `<p class="mt-3"><span class="font-bold">${key}:</span> ${dietaGato[key]}</p>`;
        });
        htmlContent += `</details>`
        htmlContent += `<hr class="my-3">`;
      }

      if(dietaBarf){
        htmlContent += `<h4 class="text-base font-bold">${dietaBarf.tituloDieta}</h4>`;
        htmlContent += `<p class="mt-3">${dietaBarf.descripDieta}</p>`;
        htmlContent += `<details class="my-3 border border-blue-100 border-spacing-1 rounded-xl p-2 px-3" open name="gato">`
        htmlContent += `<summary>Ventajas de BARF</summary>`
        Object.keys(dietaBarf.ventajasDieta).forEach(key => {
          htmlContent += `<p class="mt-3"><span class="font-bold">${key}:</span> ${dietaBarf.ventajasDieta[key]}</p>`;
        });
        htmlContent += `</details>`

        htmlContent += `<details class="my-3 border border-blue-100 border-spacing-1 rounded-xl p-2 px-3" open name="gato">`
        htmlContent += `<summary>Desventajas de BARF</summary>`
        Object.keys(dietaBarf.desventajasDieta).forEach(key => {
          htmlContent += `<p class="mt-3"><span class="font-bold">${key}:</span> ${dietaBarf.desventajasDieta[key]}</p>`;
        });
        htmlContent += `</details>`

        htmlContent += `<details class="my-3 border border-blue-100 border-spacing-1 rounded-xl p-2 px-3" open name="gato">`
        htmlContent += `<summary>Diferencias en la Dieta de Perros y Gatos</summary>`
        Object.keys(dietaBarf.diferenciasDieta).forEach(key => {
          htmlContent += `<p class="mt-3"><span class="font-bold">${key}:</span> ${dietaBarf.diferenciasDieta[key]}</p>`;
        });
        htmlContent += `</details>`

        htmlContent += `<h4 class="text-base font-semibold mt-4 text-center">Conclusión</h4>`;
        htmlContent += `<p class="mt-3">${dietaBarf.ConsideracionFinal}</p>`;


      }
    } else {
      htmlContent = `<p>No se encontraron datos de Dieta y Alimentación.</p>`;
    }

    return htmlContent;
  }

}
