import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileDogPageRoutingModule } from './profile-dog-routing.module';

import { ProfileDogPage } from './profile-dog.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileDogPageRoutingModule
  ],
  declarations: [ProfileDogPage]
})
export class ProfileDogPageModule {}
