import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PerfilPerroPageRoutingModule } from './perfil-perro-routing.module';
import { PerfilPerroPage } from './perfil-perro.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
register();


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilPerroPageRoutingModule
  ],
  declarations: [PerfilPerroPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PerfilPerroPageModule { }
