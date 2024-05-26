import { Component } from '@angular/core';
import { FirestoreService } from 'src/app/service/firestore.service';
import { QuirkyFacts } from '../interface/QuirkyFacts.models';

@Component({
  selector: 'app-data-collection',
  templateUrl: './data-collection.page.html',
  styleUrls: ['./data-collection.page.scss'],
})
export class DataCollectionPage {
  formData: QuirkyFacts = {
    categoria: '',
    Titulo: '',
    descripcion: '',
  };

  constructor(private firestoreService: FirestoreService) { }

  ngOnInit() {
  }

  submitForm(formData: QuirkyFacts) {
    console.log('Datos del formulario:', formData);
    this.firestoreService.addDocument('QuirkyFacts', formData)
      .then(() => {
        console.log('Datos subidos exitosamente a Firebase');
      })
      .catch((error) => {
        console.error('Error al subir los datos a Firebase:', error);
      });
  }
}
