import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataCollectionPage } from './data-collection.page';

const routes: Routes = [
  {
    path: '',
    component: DataCollectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataCollectionPageRoutingModule {}
