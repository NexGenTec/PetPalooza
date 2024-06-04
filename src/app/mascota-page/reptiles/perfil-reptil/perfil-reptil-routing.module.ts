import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilReptilPage } from './perfil-reptil.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilReptilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilReptilPageRoutingModule {}
