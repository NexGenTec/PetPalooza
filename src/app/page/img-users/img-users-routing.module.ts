import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImgUsersPage } from './img-users.page';

const routes: Routes = [
  {
    path: '',
    component: ImgUsersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImgUsersPageRoutingModule {}
