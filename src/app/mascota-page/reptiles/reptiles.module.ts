import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReptilesPageRoutingModule } from './reptiles-routing.module';

import { ReptilesPage } from './reptiles.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReptilesPageRoutingModule
  ],
  declarations: [ReptilesPage]
})
export class ReptilesPageModule {}
