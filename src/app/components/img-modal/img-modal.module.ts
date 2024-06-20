import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImgModalPageRoutingModule } from './img-modal-routing.module';

import { ImgModalPage } from './img-modal.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImgModalPageRoutingModule
  ],
  declarations: [ImgModalPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ImgModalPageModule { }
