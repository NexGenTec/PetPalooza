import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'ave',
        loadChildren: () => import('../mascota-page/aves/aves.module').then(m => m.AvesPageModule)
      },
      {
        path: 'reptil',
        loadChildren: () => import('../mascota-page/reptiles/reptiles.module').then(m => m.ReptilesPageModule)
      },
      {
        path: 'roedor',
        loadChildren: () => import('../mascota-page/roedores/roedores.module').then(m => m.RoedoresPageModule)
      },
      {
        path: 'gato',
        loadChildren: () => import('../mascota-page/gato/gato.module').then(m => m.gatoPageModule)
      },
      {
        path: 'perro',
        loadChildren: () => import('../mascota-page/perro/perro.module').then(m => m.perroPageModule)
      },
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.homePageModule)
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
        path: 'data-collection',
        loadChildren: () => import('../data-collection/data-collection.module').then( m => m.DataCollectionPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/data-collection',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/data-collection',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
