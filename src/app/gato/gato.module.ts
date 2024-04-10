import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { gatoPage } from './gato.page';


import { gatoPageRoutingModule } from './gato-routing.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
register();


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    gatoPageRoutingModule
  ],
  declarations: [gatoPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class gatoPageModule { }
