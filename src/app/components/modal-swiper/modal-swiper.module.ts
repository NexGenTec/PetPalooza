import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalSwiperPageRoutingModule } from './modal-swiper-routing.module';

import { ModalSwiperPage } from './modal-swiper.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
register();


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalSwiperPageRoutingModule
  ],
  declarations: [ModalSwiperPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalSwiperPageModule {}
