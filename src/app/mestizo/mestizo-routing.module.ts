import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MestizoPage } from './mestizo.page';

const routes: Routes = [
  {
    path: '',
    component: MestizoPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MestizoPageRoutingModule {}
