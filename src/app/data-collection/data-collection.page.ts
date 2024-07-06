import { Component } from '@angular/core';
import { FirestoreService } from 'src/app/service/firestore.service';
import { QuirkyFacts } from '../interface/QuirkyFacts.models';
import { ToastController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

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
  quirkyFactsList: QuirkyFacts[] = [];

  constructor(
    private firestoreService: FirestoreService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.loadQuirkyFacts();
   }

  async submitForm(form: NgForm) {
    console.log('Datos del formulario:', this.formData);
    this.firestoreService.addDocument('QuirkyFacts', this.formData)
      .then(() => {
        this.presentToast('Datos subidos exitosamente a Firebase');
        this.resetForm(form);
      })
      .catch((error) => {
        this.presentToast('Error al subir los datos a Firebase');
      });
  }

  resetForm(form: NgForm) {
    form.resetForm();
    this.formData = {
      categoria: '',
      Titulo: '',
      descripcion: '',
    };
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'success',
      position: 'top'
    });
    toast.present();
  }

  loadQuirkyFacts() {
    this.firestoreService.getCollection<QuirkyFacts>('QuirkyFacts').subscribe(data => {
      this.quirkyFactsList = data;
    });
  }
}
