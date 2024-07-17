import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatModalPage } from './cat-modal.page';

const routes: Routes = [
  {
    path: '',
    component: CatModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatModalPageRoutingModule {}
