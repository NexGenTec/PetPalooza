import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PetsPage } from './pets.page';

const routes: Routes = [
  {
    path: '',
    component: PetsPage
  },
  {
    path: 'cat',
    loadChildren: () => import('./cat/cat.module').then( m => m.CatPageModule)
  },
  {
    path: 'dog',
    loadChildren: () => import('./dog/dog.module').then( m => m.DogPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PetsPageRoutingModule {}
