import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilRoedorPageRoutingModule } from './perfil-roedor-routing.module';

import { PerfilRoedorPage } from './perfil-roedor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilRoedorPageRoutingModule
  ],
  declarations: [PerfilRoedorPage]
})
export class PerfilRoedorPageModule {}
