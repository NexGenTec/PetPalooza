import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CuidadosPageRoutingModule } from './cuidados-routing.module';

import { CuidadosPage } from './cuidados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CuidadosPageRoutingModule
  ],
  declarations: [CuidadosPage]
})
export class CuidadosPageModule {}
