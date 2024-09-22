import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatModalPageRoutingModule } from './cat-modal-routing.module';

import { CatModalPage } from './cat-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatModalPageRoutingModule
  ],
  declarations: [CatModalPage]
})
export class CatModalPageModule {}
