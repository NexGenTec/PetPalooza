import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CuidadosPage } from './cuidados.page';

const routes: Routes = [
  {
    path: '',
    component: CuidadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CuidadosPageRoutingModule {}
