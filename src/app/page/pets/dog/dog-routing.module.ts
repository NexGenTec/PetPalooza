import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DogPage } from './dog.page';

const routes: Routes = [
  {
    path: '',
    component: DogPage
  },
  {
    path: 'dog-modal',
    loadChildren: () => import('./dog-modal/dog-modal.module').then( m => m.DogModalPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DogPageRoutingModule {}
