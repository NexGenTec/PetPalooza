import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MatchFavoritePage } from './match-favorite.page';

const routes: Routes = [
  {
    path: '',
    component: MatchFavoritePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchFavoritePageRoutingModule {}
