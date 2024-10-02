import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilReptilPageRoutingModule } from './perfil-reptil-routing.module';

import { PerfilReptilPage } from './perfil-reptil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilReptilPageRoutingModule
  ],
  declarations: [PerfilReptilPage]
})
export class PerfilReptilPageModule {}
