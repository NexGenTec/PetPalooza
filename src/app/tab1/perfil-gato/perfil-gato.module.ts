import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilGatoPageRoutingModule } from './perfil-gato-routing.module';

import { PerfilGatoPage } from './perfil-gato.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
register();


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilGatoPageRoutingModule
  ],
  declarations: [PerfilGatoPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PerfilGatoPageModule { }
