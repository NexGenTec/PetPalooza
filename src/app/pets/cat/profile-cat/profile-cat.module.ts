import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileCatPageRoutingModule } from './profile-cat-routing.module';

import { ProfileCatPage } from './profile-cat.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
register();


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileCatPageRoutingModule
  ],
  declarations: [ProfileCatPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProfileCatPageModule {}
