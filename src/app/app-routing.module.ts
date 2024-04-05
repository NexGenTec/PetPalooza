import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'perfil-gato',
    loadChildren: () => import('./tab1/perfil-gato/perfil-gato.module').then(m => m.PerfilGatoPageModule)
  },
  {
    path: 'perfil-perro',
    loadChildren: () => import('./tab3/perfil-perro/perfil-perro.module').then(m => m.PerfilPerroPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
