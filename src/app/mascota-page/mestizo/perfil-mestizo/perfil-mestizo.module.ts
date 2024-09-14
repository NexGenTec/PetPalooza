import { NgModule } from '@angular/core';
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
  declarations: [PerfilMestizoPage]
})
export class PerfilMestizoPageModule {}
