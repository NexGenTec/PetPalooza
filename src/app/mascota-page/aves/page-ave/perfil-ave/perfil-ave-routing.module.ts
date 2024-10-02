import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilAvePage } from './perfil-ave.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilAvePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilAvePageRoutingModule {}
