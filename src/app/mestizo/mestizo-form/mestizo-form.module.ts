import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MestizoFormPageRoutingModule } from './mestizo-form-routing.module';

import { MestizoFormPage } from './mestizo-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MestizoFormPageRoutingModule
  ],
  declarations: [MestizoFormPage]
})
export class MestizoFormPageModule {}
