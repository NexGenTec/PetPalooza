import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReptilesPage } from './reptiles.page';

const routes: Routes = [
  {
    path: '',
    component: ReptilesPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReptilesPageRoutingModule { }
