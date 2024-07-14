import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'fun-facts',
    loadChildren: () => import('./fun-facts/fun-facts.module').then( m => m.FunFactsPageModule)
  },
  {
    path: 'pets',
    loadChildren: () => import('./pets/pets.module').then( m => m.PetsPageModule)
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
    path: 'img-modal',
    loadChildren: () => import('./img-modal/img-modal.module').then(m => m.ImgModalPageModule)
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
