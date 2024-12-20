import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { homePage } from './home.page';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { homePageRoutingModule } from './home-routing.module';
import { register } from 'swiper/element/bundle';
register();

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    homePageRoutingModule,
  ],
  declarations: [homePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class homePageModule { }
