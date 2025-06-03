import { Component, OnInit } from '@angular/core';
import { Trivia } from '../interface/Trivia.models';
import { FirestoreService } from '../service/firestore.service';
import { NavigationEnd, Router } from '@angular/router';


@Component({
  selector: 'app-trivia',
  templateUrl: './trivia.page.html',
  styleUrls: ['./trivia.page.scss'],
})
export class TriviaPage implements OnInit {

  questionsTrivia: Trivia[] = [];
  currentQuestionIndex: number = 0;
  currentQuestion!: Trivia;
  selectedOptionIndex: number | null = null;
  showAnswerFeedback : boolean = false;
  isCorrectAnswer: boolean = false;
  score: number = 0;

  showLevelsQuiz: boolean = false
  showLevelsBreed: boolean = false

  constructor(
    private firestores : FirestoreService,
    private router: Router,

  ) { }

  ngOnInit(): void {
}

toggleLevelsQuiz() {
this.showLevelsQuiz =!this.showLevelsQuiz;
}

toggleLevelsBreed() {
this.showLevelsBreed =!this.showLevelsBreed;
}

goToLevel(level: string) {
  this.router.navigate(['/trivia/quiz', level]);
}

getQuestionsByLevel(level: 'basic' | 'medium' | 'hard'): void {
  this.firestores.getCollectionChanges<Trivia>('Trivia').subscribe(questions => {
    const filteredQuestions = questions.filter(q => q.type === 'text' && q.level === level);
    console.log(`Preguntas nivel ${level}:`, filteredQuestions);

    if (filteredQuestions.length > 0) {
      this.questionsTrivia = filteredQuestions;
      this.currentQuestionIndex = 0;
      this.currentQuestion = this.questionsTrivia[0];
    }
  });
}



goToBreed(level:string) {
  this.router.navigate(['/trivia-breed'], {queryParams: {level}});
};
  
goToQuiz(level: string) {
  this.router.navigate(['/trivia-quiz'], {queryParams:{level}
  });
};




}

