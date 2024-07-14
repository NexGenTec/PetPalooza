import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DogPageRoutingModule } from './dog-routing.module';

import { DogPage } from './dog.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
register();

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DogPageRoutingModule
  ],
  declarations: [DogPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DogPageModule {}
