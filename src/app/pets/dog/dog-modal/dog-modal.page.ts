import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { InfoPerro } from 'src/app/interface/InfoPerro.models';

@Component({
  selector: 'app-dog-modal',
  templateUrl: './dog-modal.page.html',
  styleUrls: ['./dog-modal.page.scss'],
})
export class DogModalPage implements OnInit {
  
  @Input() newPerro: InfoPerro;
  @ViewChild('datePicker') datePicker;
  showDatePicker: boolean = false;
  imageFile: File | null = null;
  imagesFiles: File[] = [];
  existingImage: string | null = null;
  formattedFechaCreacion: string = '';
  selectedImages: string[] = [];

  constructor(private modalController: ModalController) {}

  ngOnInit(): void {
    if (!this.newPerro.fechaCreacion || 
        (this.newPerro.fechaCreacion.seconds === 0 && this.newPerro.fechaCreacion.nanoseconds === 0)) {
      const now = new Date();
      this.newPerro.fechaCreacion = {
        seconds: Math.floor(now.getTime() / 1000),
        nanoseconds: (now.getTime() % 1000) * 1e6,
        isoString: now.toISOString()
      };
    } else {
      const fecha = new Date(this.newPerro.fechaCreacion.seconds * 1000);
      this.newPerro.fechaCreacion = {
        seconds: this.newPerro.fechaCreacion.seconds,
        nanoseconds: this.newPerro.fechaCreacion.nanoseconds,
        isoString: fecha.toISOString()
      };
    }
    this.updateFechaCreacion();

    if (this.newPerro.imgPerfil) {
      this.existingImage = this.newPerro.imgPerfil;
      this.imageFile = null;
    }

    if (this.newPerro.Img && this.newPerro.Img.length) {
      this.selectedImages = this.newPerro.Img;
    }
  }

  updateFechaCreacion() {
    if (this.newPerro.fechaCreacion && this.newPerro.fechaCreacion.isoString) {
      const fecha = new Date(this.newPerro.fechaCreacion.isoString);
      this.formattedFechaCreacion = fecha.toLocaleDateString() + ' ' + fecha.toLocaleTimeString();
    }
  }

  setCurrentDateTime() {
    const now = new Date();
    this.newPerro.fechaCreacion = {
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

  addPerro(perroForm: any) {
    if (perroForm.valid) {
      this.modalController.dismiss({ perro: this.newPerro, imageFile: this.imageFile, imagesFiles: this.imagesFiles });
    }
  }

  updatePerro(form: any) {
    if (form.valid) {
      this.modalController.dismiss({ perro: this.newPerro, imageFile: this.imageFile, imagesFiles: this.imagesFiles, action: 'update' });
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
    this.newPerro.Cuidados.push({ tipo: '', descripcion: '' });
  }

  removeCuidado(index: number) {
    this.newPerro.Cuidados.splice(index, 1);
  }

  addCaracteristicaFisica() {
    this.newPerro.caracteristicasFisicas.push({ tipo: '', descripcion: '' });
  }

  removeCaracteristicaFisica(index: number) {
    this.newPerro.caracteristicasFisicas.splice(index, 1);
  }

  addTemperamento() {
    this.newPerro.Temperamento.push({ tipo: '', descripcion: '' });
  }

  removeTemperamento(index: number) {
    this.newPerro.Temperamento.splice(index, 1);
  }
  
  removeImage(index: number) {
    this.selectedImages.splice(index, 1);
  }
}
