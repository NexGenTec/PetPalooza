import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { InfoGato } from '../../../interface/InfoGato.models';

@Component({
  selector: 'app-cat-modal',
  templateUrl: './cat-modal.page.html',
  styleUrls: ['./cat-modal.page.scss'],
})
export class CatModalPage implements OnInit {
  @Input() newGato: InfoGato;
  @ViewChild('datePicker') datePicker;
  showDatePicker: boolean = false;
  imageFile: File | null = null;
  imagesFiles: File[] = [];
  existingImage: string | null = null;
  formattedFechaCreacion: string = '';
  selectedImages: string[] = [];

  constructor(private modalController: ModalController) {}

  ngOnInit(): void {
    if (!this.newGato.fechaCreacion || 
        (this.newGato.fechaCreacion.seconds === 0 && this.newGato.fechaCreacion.nanoseconds === 0)) {
      const now = new Date();
      this.newGato.fechaCreacion = {
        seconds: Math.floor(now.getTime() / 1000),
        nanoseconds: (now.getTime() % 1000) * 1e6,
        isoString: now.toISOString()
      };
    } else {
      const fecha = new Date(this.newGato.fechaCreacion.seconds * 1000);
      this.newGato.fechaCreacion = {
        seconds: this.newGato.fechaCreacion.seconds,
        nanoseconds: this.newGato.fechaCreacion.nanoseconds,
        isoString: fecha.toISOString()
      };
    }
    this.updateFechaCreacion();

    if (this.newGato.imgPerfil) {
      this.existingImage = this.newGato.imgPerfil;
      this.imageFile = null;
    }

    if (this.newGato.Img && this.newGato.Img.length) {
      this.selectedImages = this.newGato.Img;
    }
  }

  updateFechaCreacion() {
    if (this.newGato.fechaCreacion && this.newGato.fechaCreacion.isoString) {
      const fecha = new Date(this.newGato.fechaCreacion.isoString);
      this.formattedFechaCreacion = fecha.toLocaleDateString() + ' ' + fecha.toLocaleTimeString();
    }
  }

  setCurrentDateTime() {
    const now = new Date();
    this.newGato.fechaCreacion = {
      seconds: Math.floor(now.getTime() / 1000),
      nanoseconds: (now.getTime() % 1000) * 1e6,
      isoString: now.toISOString()
    };
    this.updateFechaCreacion();
  }

  getMinDate(): string {
    const today = new Date();
    return today.toISOString();
  }

  getMaxDate(): string {
    const today = new Date();
    return new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()).toISOString();
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  addGato(gatoForm: any) {
    if (gatoForm.valid) {
      this.modalController.dismiss({ gato: this.newGato, imageFile: this.imageFile, imagesFiles: this.imagesFiles });
    }
  }

  updateGato(form: any) {
    if (form.valid) {
      this.modalController.dismiss({ gato: this.newGato, imageFile: this.imageFile, imagesFiles: this.imagesFiles, action: 'update' });
    }
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      this.imageFile = target.files[0];
    }
  }

  onFileSelecteds(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      this.imagesFiles = Array.from(target.files).slice(0, 10);
      this.selectedImages = this.imagesFiles.map(file => URL.createObjectURL(file));
    }
  }

  getSelectedImage(): string | null {
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

  removeImage(index: number) {
    this.selectedImages.splice(index, 1);
    this.imagesFiles.splice(index, 1);
  }
}
