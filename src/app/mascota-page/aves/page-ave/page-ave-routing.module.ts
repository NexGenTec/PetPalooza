import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageAvePage } from './page-ave.page';

const routes: Routes = [
  {
    path: '',
    component: PageAvePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageAvePageRoutingModule {}
