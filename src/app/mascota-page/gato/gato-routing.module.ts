import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { gatoPage } from './gato.page';

const routes: Routes = [
  {
    path: '',
    component: gatoPage,
  },
  {
    path: 'add-image',
    loadChildren: () => import('./add-image/add-image.module').then( m => m.AddImagePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class gatoPageRoutingModule { }
