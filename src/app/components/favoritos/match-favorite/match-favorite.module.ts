import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatchFavoritePageRoutingModule } from './match-favorite-routing.module';

import { MatchFavoritePage } from './match-favorite.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatchFavoritePageRoutingModule
  ],
  declarations: [MatchFavoritePage]
})
export class MatchFavoritePageModule {}
