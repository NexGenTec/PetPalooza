import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FoundationsPageRoutingModule } from './foundations-routing.module';

import { FoundationsPage } from './foundations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FoundationsPageRoutingModule
  ],
  declarations: [FoundationsPage]
})
export class FoundationsPageModule {}
