import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatPageRoutingModule } from './cat-routing.module';

import { CatPage } from './cat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatPageRoutingModule
  ],
  declarations: [CatPage]
})
export class CatPageModule {}
