import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilAvePageRoutingModule } from './perfil-ave-routing.module';

import { PerfilAvePage } from './perfil-ave.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
register();

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilAvePageRoutingModule
  ],
  declarations: [PerfilAvePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PerfilAvePageModule { }
