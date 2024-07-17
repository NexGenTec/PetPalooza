import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/service/firestore.service';
import { QuirkyFacts } from '../interface/QuirkyFacts.models';
import { ToastController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-fun-facts',
  templateUrl: './fun-facts.page.html',
  styleUrls: ['./fun-facts.page.scss'],
})
export class FunFactsPage implements OnInit {
  formData: QuirkyFacts = {
    categoria: '',
    Titulo: '',
    descripcion: '',
  };
  quirkyFactsList: ({ id: string } & QuirkyFacts)[] = [];
  editingFactId: string;

  constructor(
    private firestoreService: FirestoreService,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    this.loadQuirkyFacts();
  }

  async submitForm(form: NgForm) {
    if (form.invalid) {
      this.presentToast('Por favor, completa todos los campos obligatorios.');
      return;
    }

    // console.log('Datos del formulario:', this.formData);
    // this.firestoreService.addDocument('QuirkyFacts', this.formData)
    //   .then(() => {
    //     this.presentToast('Datos subidos exitosamente a Firebase');
    //     this.resetForm(form);
    //     this.loadQuirkyFacts();
    //   })
    //   .catch((error) => {
    //     this.presentToast('Error al subir los datos a Firebase');
    //   });
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
    this.firestoreService.getCollectionChanges<QuirkyFacts>('QuirkyFacts').subscribe(data => {
      this.quirkyFactsList = data;
      console.log('Datos cargados:', this.quirkyFactsList);
    });
  }

  deleteFact(id: string) {
    console.log('ID to delete:', id);
    this.firestoreService.deleteDocument('QuirkyFacts', id)
      .then(() => {
        this.presentToast('Dato curioso eliminado exitosamente de Firebase');
        this.loadQuirkyFacts();
      })
      .catch((error) => {
        this.presentToast('Error al eliminar el dato curioso de Firebase');
        console.error('Error:', error);
      });
  }

}