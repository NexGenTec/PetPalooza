import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilPerroPage } from './perfil-perro.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilPerroPage
  },  {
    path: 'img-modal-swiper',
    loadChildren: () => import('./img-modal-swiper/img-modal-swiper.module').then( m => m.ImgModalSwiperPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilPerroPageRoutingModule { }
