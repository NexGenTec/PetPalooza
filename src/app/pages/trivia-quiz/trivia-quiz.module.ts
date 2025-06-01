import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TriviaQuizPageRoutingModule } from './trivia-quiz-routing.module';

import { TriviaQuizPage } from './trivia-quiz.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TriviaQuizPageRoutingModule
  ],
  declarations: [TriviaQuizPage]
})
export class TriviaQuizPageModule {}
