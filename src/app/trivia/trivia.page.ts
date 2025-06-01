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


  constructor(
    private firestores : FirestoreService,
    private router: Router,

  ) { }

  ngOnInit(): void {
}


goToBreed() {
  this.router.navigate(['/trivia-breed']);
};
  
goToQuiz() {
  this.router.navigate(['/trivia-quiz']);
};


}

