import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TriviaBreedPage } from './trivia-breed.page';

const routes: Routes = [
  {
    path: '',
    component: TriviaBreedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TriviaBreedPageRoutingModule {}
