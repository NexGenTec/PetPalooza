import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FunFactsPage } from './fun-facts.page';

const routes: Routes = [
  {
    path: '',
    component: FunFactsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FunFactsPageRoutingModule {}
