import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileCatPage } from './profile-cat.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileCatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileCatPageRoutingModule {}
