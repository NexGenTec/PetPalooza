import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilRoedorPage } from './perfil-roedor.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilRoedorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilRoedorPageRoutingModule {}
