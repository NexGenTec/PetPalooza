import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { InfoGato } from '../../../interface/InfoGato.models';

@Component({
  selector: 'app-cat-modal',
  templateUrl: './cat-modal.page.html',
  styleUrls: ['./cat-modal.page.scss'],
})
export class CatModalPage implements OnInit {
  @Input() newGato: InfoGato;
  imageFile: File | null = null;
  existingImage: string | null = null;

  constructor(private modalController: ModalController,
  ) {}

  ngOnInit(): void {
    // Verificar si el gato tiene una imagen existente
    if (this.newGato.imgPerfil) {
      this.existingImage = this.newGato.imgPerfil; // Guardar la URL de la imagen existente
      this.imageFile = null; // Limpiar el archivo seleccionado para no mostrar la imagen existente
    }
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  addGato(gatoForm: any) {
    if (gatoForm.valid) {
      console.log('Nuevo gato:', this.newGato);
      console.log('Archivo de imagen:', this.imageFile);
      // Asegúrate de que estás enviando el objeto completo con la imagen
      this.modalController.dismiss({ gato: this.newGato, imageFile: this.imageFile });
    }
  }

  updateGato(form: any) {
    if (form.valid) {
      // Si se seleccionó una nueva imagen, reemplazar la imagen existente
      if (this.imageFile) {
        this.modalController.dismiss({ gato: this.newGato, imageFile: this.imageFile, action: 'update' });
      } else {
        // Si no se seleccionó una nueva imagen, mantener la imagen existente
        this.modalController.dismiss({ gato: this.newGato, imageFile: null, action: 'update' });
      }
    }
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      this.imageFile = target.files[0];
    }
  }

  getSelectedImage(): string | null {
    // Mostrar la imagen seleccionada o la existente si no se seleccionó una nueva
    return this.imageFile ? URL.createObjectURL(this.imageFile) : this.existingImage;
  }

  addCuidado() {
    this.newGato.Cuidados.push({ tipo: '', descripcion: '' });
  }

  removeCuidado(index: number) {
    this.newGato.Cuidados.splice(index, 1);
  }

  addCaracteristicaFisica() {
    this.newGato.caracteristicasFisicas.push({ tipo: '', descripcion: '' });
  }

  removeCaracteristicaFisica(index: number) {
    this.newGato.caracteristicasFisicas.splice(index, 1);
  }

  addTemperamento() {
    this.newGato.Temperamento.push({ tipo: '', descripcion: '' });
  }

  removeTemperamento(index: number) {
    this.newGato.Temperamento.splice(index, 1);
  }
}
