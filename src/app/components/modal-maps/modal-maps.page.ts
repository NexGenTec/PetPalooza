import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Maps } from 'src/app/interface/Maps.model';

@Component({
  selector: 'app-modal-maps',
  templateUrl: './modal-maps.page.html',
  styleUrls: ['./modal-maps.page.scss'],
})
export class ModalMapsPage implements OnInit {
  mapsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.mapsForm = this.fb.group({
      Nombre: ['', [Validators.required]],
      Descripcion: ['', [Validators.required, Validators.minLength(10)]],
      Img: ['', [Validators.required]],
      Whatsapp: ['', [Validators.required, Validators.pattern(/^(\+?56)?(\d{9})$/)]], // Assuming Chilean format
      Web: ['', [Validators.pattern('https?://.+')]],
      Facebook: ['', [Validators.pattern('https?://.+')]],
      Instagram: ['', [Validators.pattern('https?://.+')]],
      Direccion: ['', [Validators.required]],
      Latitud: ['', [Validators.required]],
      Longitud: ['', [Validators.required]],
      Categoria: ['', [Validators.required]],
    });
  }

  submitForm() {
    if (this.mapsForm.valid) {
      const newVeterinaria: Maps = this.mapsForm.value;
      this.modalController.dismiss({ veterinaria: newVeterinaria });
    }
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}
