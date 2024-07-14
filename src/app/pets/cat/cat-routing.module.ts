import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatPage } from './cat.page';

const routes: Routes = [
  {
    path: '',
    component: CatPage
  },
  {
    path: 'profile-cat',
    loadChildren: () => import('./profile-cat/profile-cat.module').then( m => m.ProfileCatPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatPageRoutingModule {}
