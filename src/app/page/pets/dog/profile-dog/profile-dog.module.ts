import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileDogPageRoutingModule } from './profile-dog-routing.module';

import { ProfileDogPage } from './profile-dog.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
register();


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileDogPageRoutingModule
  ],
  declarations: [ProfileDogPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProfileDogPageModule {}
