import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DataCollectionPageRoutingModule } from './data-collection-routing.module';

import { DataCollectionPage } from './data-collection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DataCollectionPageRoutingModule
  ],
  declarations: [DataCollectionPage]
})
export class DataCollectionPageModule {}
