import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { perroPage } from './perro.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
register();


import { perroPageRoutingModule } from './perro-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,

    perroPageRoutingModule
  ],
  declarations: [perroPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class perroPageModule { }
