import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DogModalPageRoutingModule } from './dog-modal-routing.module';

import { DogModalPage } from './dog-modal.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
register();

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DogModalPageRoutingModule
  ],
  declarations: [DogModalPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DogModalPageModule {}
