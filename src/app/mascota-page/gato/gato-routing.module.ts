import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { gatoPage } from './gato.page';

const routes: Routes = [
  {
    path: '',
    component: gatoPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class gatoPageRoutingModule { }
