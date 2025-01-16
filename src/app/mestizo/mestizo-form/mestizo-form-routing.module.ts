import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MestizoFormPage } from './mestizo-form.page';

const routes: Routes = [
  {
    path: '',
    component: MestizoFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MestizoFormPageRoutingModule {}
