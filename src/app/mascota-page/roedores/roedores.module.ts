import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoedoresPageRoutingModule } from './roedores-routing.module';

import { RoedoresPage } from './roedores.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoedoresPageRoutingModule
  ],
  declarations: [RoedoresPage]
})
export class RoedoresPageModule {}
