import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { InfoGato, CaracteristicasFisicas } from '../../../interface/InfoGato.models';

@Component({
  selector: 'app-cat-modal',
  templateUrl: './cat-modal.page.html',
  styleUrls: ['./cat-modal.page.scss'],
})
export class CatModalPage implements OnInit {
  @Input() newGato: InfoGato;
  imageFile: File | null = null;
  caracteristicasFisicas: CaracteristicasFisicas[] = [];
  nuevaCaracteristica: CaracteristicasFisicas = { nombre: '', descripcion: '' };

  constructor(private modalController: ModalController) {}

  ngOnInit(): void {
    this.caracteristicasFisicas = this.getCaracteristicasFisicas();
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  addGato(gatoForm: any) {
    if (gatoForm.valid) {
      this.modalController.dismiss({ gato: this.newGato });
    }
  }

  updateGato(form: any) {
    if (form.valid) {
      this.modalController.dismiss({ gato: this.newGato, action: 'update' });
    }
  }

  addTemperamento() {
    this.newGato.Temperamento.push({ tipo: '', descripcion: '', aplicable: true });
  }

  removeTemperamento(index: number) {
    this.newGato.Temperamento.splice(index, 1);
  }

  getCuidadosKeys() {
    return Object.keys(this.newGato.cuidados);
  }

  removeCuidado(cuidadoKey: string) {
    delete this.newGato.cuidados[cuidadoKey];
  }

  addCaracteristica() {
    if (this.nuevaCaracteristica.nombre && this.nuevaCaracteristica.descripcion) {
      this.newGato.CaractFisicas.push({ ...this.nuevaCaracteristica });
      this.nuevaCaracteristica = { nombre: '', descripcion: '' };
      this.caracteristicasFisicas = this.getCaracteristicasFisicas();
    }
  }

  removeCaracteristica(nombre: string) {
    this.newGato.CaractFisicas = this.newGato.CaractFisicas.filter(cf => cf.nombre !== nombre);
    this.caracteristicasFisicas = this.getCaracteristicasFisicas();
  }

  private getCaracteristicasFisicas(): CaracteristicasFisicas[] {
    return [...this.newGato.CaractFisicas];
  }

  onFileSelected(event: any) {
    this.imageFile = event.target.files[0];
  }
}
