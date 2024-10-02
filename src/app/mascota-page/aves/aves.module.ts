import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AvesPageRoutingModule } from './aves-routing.module';
import { AvesPage } from './aves.page';
import { register } from 'swiper/element/bundle';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
register();

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AvesPageRoutingModule
  ],
  declarations: [AvesPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AvesPageModule {}
