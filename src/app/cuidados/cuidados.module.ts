import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CuidadosPageRoutingModule } from './cuidados-routing.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CuidadosPage } from './cuidados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CuidadosPageRoutingModule
  ],
  declarations: [CuidadosPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CuidadosPageModule { }
