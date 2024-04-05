import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilGatoPage } from './perfil-gato.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilGatoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilGatoPageRoutingModule {}
