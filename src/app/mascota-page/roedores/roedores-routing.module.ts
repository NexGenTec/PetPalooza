import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoedoresPage } from './roedores.page';

const routes: Routes = [
  {
    path: '',
    component: RoedoresPage
  },  {
    path: 'perfil-roedor',
    loadChildren: () => import('./perfil-roedor/perfil-roedor.module').then( m => m.PerfilRoedorPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoedoresPageRoutingModule {}
