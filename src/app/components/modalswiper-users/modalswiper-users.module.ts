import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalswiperUsersPageRoutingModule } from './modalswiper-users-routing.module';

import { ModalswiperUsersPage } from './modalswiper-users.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
register();


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalswiperUsersPageRoutingModule
  ],
  declarations: [ModalswiperUsersPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalswiperUsersPageModule { }
