import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageAvePageRoutingModule } from './page-ave-routing.module';

import { PageAvePage } from './page-ave.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageAvePageRoutingModule
  ],
  declarations: [PageAvePage]
})
export class PageAvePageModule {}
