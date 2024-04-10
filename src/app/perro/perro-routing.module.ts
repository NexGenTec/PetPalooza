import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { perroPage } from './perro.page';

const routes: Routes = [
  {
    path: '',
    component: perroPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class perroPageRoutingModule { }
