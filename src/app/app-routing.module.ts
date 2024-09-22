import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'fun-facts',
    loadChildren: () => import('./page/fun-facts/fun-facts.module').then( m => m.FunFactsPageModule)
  },
  {
    path: 'foundations',
    loadChildren: () => import('./page/foundations/foundations.module').then( m => m.FoundationsPageModule)
  },
  {
    path: 'pets',
    loadChildren: () => import('./page/pets/pets.module').then( m => m.PetsPageModule)
  },
  {
    path: 'profile-dog/:id',
    loadChildren: () => import('../app/page/pets/dog/profile-dog/profile-dog.module').then( m => m.ProfileDogPageModule)
  },
  {
    path: 'profile-cat/:id',
    loadChildren: () => import('../app/page/pets/cat/profile-cat/profile-cat.module').then( m => m.ProfileCatPageModule)
  },
  {
    path: 'img-modal',
    loadChildren: () => import('./components/img-modal/img-modal.module').then(m => m.ImgModalPageModule)
  },
  {
    path: 'modal-swiper',
    loadChildren: () => import('./components/modal-swiper/modal-swiper.module').then( m => m.ModalSwiperPageModule)
  },
  {
    path: 'welcome-modal',
    loadChildren: () => import('./components/welcome-modal/welcome-modal.module').then(m => m.WelcomeModalPageModule)
  },
  {
    path: '',
    redirectTo: 'pets',
    pathMatch: 'full'
  },
  {
    path: 'maps',
    loadChildren: () => import('./page/maps/maps.module').then( m => m.MapsPageModule)
  },
  {
    path: 'img-users',
    loadChildren: () => import('./page/img-users/img-users.module').then( m => m.ImgUsersPageModule)
  },
  {
    path: 'modal-maps',
    loadChildren: () => import('./components/modal-maps/modal-maps.module').then( m => m.ModalMapsPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
