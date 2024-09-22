import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FunFactsPageRoutingModule } from './fun-facts-routing.module';

import { FunFactsPage } from './fun-facts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FunFactsPageRoutingModule
  ],
  declarations: [FunFactsPage]
})
export class FunFactsPageModule {}
