import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MestizoPage } from './mestizo.page';

const routes: Routes = [
  {
    path: '',
    component: MestizoPage
  },  {
    path: 'perfil-mestizo',
    loadChildren: () => import('./perfil-mestizo/perfil-mestizo.module').then( m => m.PerfilMestizoPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MestizoPageRoutingModule {}
