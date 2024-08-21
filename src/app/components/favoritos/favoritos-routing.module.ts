import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FavoritosPage } from './favoritos.page';

const routes: Routes = [
  {
    path: '',
    component: FavoritosPage
  },
  {
    path: 'match-favorite',
    loadChildren: () => import('../favoritos/match-favorite/match-favorite.module').then( m => m.MatchFavoritePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavoritosPageRoutingModule { }
