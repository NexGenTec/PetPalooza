import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TriviaQuizPage } from './trivia-quiz.page';

const routes: Routes = [
  {
    path: '',
    component: TriviaQuizPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TriviaQuizPageRoutingModule {}
