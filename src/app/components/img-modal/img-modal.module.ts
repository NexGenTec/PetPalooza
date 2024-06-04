import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImgModalPageRoutingModule } from './img-modal-routing.module';

import { ImgModalPage } from './img-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImgModalPageRoutingModule
  ],
  declarations: [ImgModalPage]
})
export class ImgModalPageModule { }
