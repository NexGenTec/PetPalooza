import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MestizoFormPageRoutingModule } from './mestizo-form-routing.module';

import { MestizoFormPage } from './mestizo-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MestizoFormPageRoutingModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [MestizoFormPage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class MestizoFormPageModule {}
