import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'fun-facts',
    loadChildren: () => import('./fun-facts/fun-facts.module').then( m => m.FunFactsPageModule)
  },
  {
    path: 'foundations',
    loadChildren: () => import('./foundations/foundations.module').then( m => m.FoundationsPageModule)
  },
  {
    path: 'pets',
    loadChildren: () => import('./pets/pets.module').then( m => m.PetsPageModule)
  },
  {
    path: 'profile-dog/:id',
    loadChildren: () => import('../app/pets/dog/profile-dog/profile-dog.module').then( m => m.ProfileDogPageModule)
  },
  {
    path: 'profile-cat/:id',
    loadChildren: () => import('../app/pets/cat/profile-cat/profile-cat.module').then( m => m.ProfileCatPageModule)
  },
  {
    path: 'img-modal',
    loadChildren: () => import('./img-modal/img-modal.module').then(m => m.ImgModalPageModule)
  },
  {
    path: 'modal-swiper',
    loadChildren: () => import('./modal-swiper/modal-swiper.module').then( m => m.ModalSwiperPageModule)
  },
  {
    path: 'welcome-modal',
    loadChildren: () => import('./welcome-modal/welcome-modal.module').then(m => m.WelcomeModalPageModule)
  },
  {
    path: '',
    redirectTo: 'pets',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
