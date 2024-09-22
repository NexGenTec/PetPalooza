import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, LoadingController, ToastController } from '@ionic/angular';
import { Maps } from '../../../interface/Maps.model';
import { FirestoreService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-modal-maps',
  templateUrl: './modal-maps.page.html',
  styleUrls: ['./modal-maps.page.scss'],
})
export class ModalMapsPage implements OnInit {
  mapsForm: FormGroup;
  isEdit: boolean;
  map: Maps;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private firestoreService: FirestoreService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.mapsForm = this.formBuilder.group({
      Nombre: ['', Validators.required],
      Descripcion: ['', Validators.required],
      Img: ['', Validators.required],
      Whatsapp: [''],
      Web: [''],
      Facebook: [''],
      Instagram: [''],
      Direccion: ['', Validators.required],
      Latitud: ['', Validators.required],
      Longitud: ['', Validators.required],
      Categoria: ['', Validators.required],
    });

    if (this.map) {
      this.isEdit = true;
      this.mapsForm.patchValue(this.map);
    }
  }

  async submitForm() {
    if (this.mapsForm.valid) {
      const newMap: Maps = this.mapsForm.value as Maps;

      const loading = await this.loadingController.create({
        message: 'Subiendo datos...',
        mode: 'ios'
      });
      await loading.present();

      // Si es edición, actualiza el documento; si no, lo crea
      if (this.isEdit) {
        await this.firestoreService.updateDocument<Maps>('Maps', this.map.id, newMap);
      } else {
        await this.firestoreService.addDocument<Maps>('Maps', newMap);
      }

      await loading.dismiss();
      this.showToast('Datos guardados con éxito', 'success');
      this.dismissModal();
    }
  }

  // Mostrar un toast
  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top',
    });
    await toast.present();
  }

  // Cerrar el modal
  dismissModal() {
    this.modalController.dismiss();
  }
}
