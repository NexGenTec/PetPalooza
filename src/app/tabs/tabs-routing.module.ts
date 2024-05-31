import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'gato',
        loadChildren: () => import('../gato/gato.module').then(m => m.gatoPageModule)
      },
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.homePageModule)
      },
      {
        path: 'perro',
        loadChildren: () => import('../perro/perro.module').then(m => m.perroPageModule)
      },
      {
        path: 'adoptame',
        loadChildren: () => import('../adoptame/adoptame.module').then(m => m.AdoptamePageModule)
      },
      {
        path: 'cuidados',
        loadChildren: () => import('../cuidados/cuidados.module').then(m => m.CuidadosPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
