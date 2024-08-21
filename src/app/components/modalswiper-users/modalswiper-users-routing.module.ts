import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalswiperUsersPage } from './modalswiper-users.page';

const routes: Routes = [
  {
    path: '',
    component: ModalswiperUsersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalswiperUsersPageRoutingModule {}
