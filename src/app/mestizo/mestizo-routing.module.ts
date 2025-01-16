import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MestizoPage } from './mestizo.page';

const routes: Routes = [
  {
    path: '',
    component: MestizoPage
  },  {
    path: 'mestizo-form',
    loadChildren: () => import('./mestizo-form/mestizo-form.module').then( m => m.MestizoFormPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MestizoPageRoutingModule {}
