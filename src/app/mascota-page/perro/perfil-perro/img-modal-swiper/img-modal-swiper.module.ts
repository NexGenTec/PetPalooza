import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ImgModalSwiperPageRoutingModule } from './img-modal-swiper-routing.module';

import { ImgModalSwiperPage } from './img-modal-swiper.page';
import { register } from 'swiper/element/bundle';
register();


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImgModalSwiperPageRoutingModule
  ],
  declarations: [ImgModalSwiperPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ImgModalSwiperPageModule { }
