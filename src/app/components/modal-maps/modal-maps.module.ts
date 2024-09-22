import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalMapsPageRoutingModule } from './modal-maps-routing.module';

import { ModalMapsPage } from './modal-maps.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalMapsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ModalMapsPage]
})
export class ModalMapsPageModule {}
