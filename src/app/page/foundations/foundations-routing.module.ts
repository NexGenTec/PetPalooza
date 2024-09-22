import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FoundationsPage } from './foundations.page';

const routes: Routes = [
  {
    path: '',
    component: FoundationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FoundationsPageRoutingModule {}
