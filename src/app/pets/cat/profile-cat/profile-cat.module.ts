import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileCatPageRoutingModule } from './profile-cat-routing.module';

import { ProfileCatPage } from './profile-cat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileCatPageRoutingModule
  ],
  declarations: [ProfileCatPage]
})
export class ProfileCatPageModule {}
