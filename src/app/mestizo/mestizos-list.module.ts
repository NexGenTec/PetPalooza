import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MestizosListPageRoutingModule } from './mestizos-list-routing.module';

import { MestizosListPage } from './mestizos-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MestizosListPageRoutingModule
  ],
  declarations: [MestizosListPage]
})
export class MestizosListPageModule {}
