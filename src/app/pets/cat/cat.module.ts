import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatPageRoutingModule } from './cat-routing.module';

import { CatPage } from './cat.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
register();

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatPageRoutingModule
  ],
  declarations: [CatPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CatPageModule {}
