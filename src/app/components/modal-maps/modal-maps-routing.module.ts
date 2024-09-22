import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalMapsPage } from './modal-maps.page';

const routes: Routes = [
  {
    path: '',
    component: ModalMapsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalMapsPageRoutingModule {}
