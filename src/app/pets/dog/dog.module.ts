import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DogPageRoutingModule } from './dog-routing.module';

import { DogPage } from './dog.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DogPageRoutingModule
  ],
  declarations: [DogPage]
})
export class DogPageModule {}
