import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilMestizoPageRoutingModule } from './perfil-mestizo-routing.module';

import { PerfilMestizoPage } from './perfil-mestizo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilMestizoPageRoutingModule
  ],
  declarations: [PerfilMestizoPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PerfilMestizoPageModule {}
