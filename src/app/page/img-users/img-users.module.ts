import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImgUsersPageRoutingModule } from './img-users-routing.module';

import { ImgUsersPage } from './img-users.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImgUsersPageRoutingModule
  ],
  declarations: [ImgUsersPage]
})
export class ImgUsersPageModule {}
