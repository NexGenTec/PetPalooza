import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DogPage } from './dog.page';

const routes: Routes = [
  {
    path: '',
    component: DogPage
  },
  {
    path: 'profile-dog/:id',
    loadChildren: () => import('./profile-dog/profile-dog.module').then( m => m.ProfileDogPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DogPageRoutingModule {}
