import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilPerroPage } from './perfil-perro.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilPerroPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilPerroPageRoutingModule { }
