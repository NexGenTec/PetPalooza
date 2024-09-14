import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'img-modal',
    loadChildren: () => import('./components/img-modal/img-modal.module').then(m => m.ImgModalPageModule)
  },
  {
    path: 'perfil-gato/:id',
    loadChildren: () => import('./mascota-page/gato/perfil-gato/perfil-gato.module').then(m => m.PerfilGatoPageModule)
  },
  {
    path: 'perfil-perro/:id',
    loadChildren: () => import('./mascota-page/perro/perfil-perro/perfil-perro.module').then(m => m.PerfilPerroPageModule)
  },
  {
    path: 'perfil-mestizo/:id',
    loadChildren: () => import('./mascota-page/mestizo/perfil-mestizo/perfil-mestizo.module').then(m => m.PerfilMestizoPageModule)
  },
  {
    path: 'page-ave/:categoria',
    loadChildren: () => import('./mascota-page/aves/page-ave/page-ave.module').then(m => m.PageAvePageModule)
  },
  {
    path: 'perfil-ave/:id',
    loadChildren: () => import('./mascota-page/aves/page-ave/perfil-ave/perfil-ave.module').then(m => m.PerfilAvePageModule)
  },
  {
    path: 'welcome-modal',
    loadChildren: () => import('./components/welcome-modal/welcome-modal.module').then(m => m.WelcomeModalPageModule)
  },
  {
    path: 'favoritos',
    loadChildren: () => import('./components/favoritos/favoritos.module').then(m => m.FavoritosPageModule)
  },
  {
    path: 'adoptame',
    loadChildren: () => import('./adoptame/adoptame.module').then(m => m.AdoptamePageModule)
  },
  {
    path: 'cuidados',
    loadChildren: () => import('./cuidados/cuidados.module').then(m => m.CuidadosPageModule)
  },
  {
    path: 'modal-swiper',
    loadChildren: () => import('./components/modal-swiper/modal-swiper.module').then(m => m.ModalSwiperPageModule)
  },
  {
    path: 'modalswiper-users',
    loadChildren: () => import('./components/modalswiper-users/modalswiper-users.module').then( m => m.ModalswiperUsersPageModule)
  },


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
