import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TriviaBreedPageRoutingModule } from './trivia-breed-routing.module';

import { TriviaBreedPage } from './trivia-breed.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TriviaBreedPageRoutingModule
  ],
  declarations: [TriviaBreedPage]
})
export class TriviaBreedPageModule {}
