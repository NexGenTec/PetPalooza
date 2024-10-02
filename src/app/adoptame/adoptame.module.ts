import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdoptamePageRoutingModule } from './adoptame-routing.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AdoptamePage } from './adoptame.page';
import { register } from 'swiper/element/bundle';
register();

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdoptamePageRoutingModule
  ],
  declarations: [AdoptamePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdoptamePageModule { }
