import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MestizoPageRoutingModule } from './mestizo-routing.module';

import { MestizoPage } from './mestizo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MestizoPageRoutingModule
  ],
  declarations: [MestizoPage]
})
export class MestizoPageModule {}
