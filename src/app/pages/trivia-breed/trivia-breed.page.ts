import { Component, OnInit } from '@angular/core';
import { Trivia } from '../../interface/Trivia.models';
import { FirestoreService } from '../../service/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trivia-breed',
  templateUrl: './trivia-breed.page.html',
  styleUrls: ['./trivia-breed.page.scss'],
})
export class TriviaBreedPage implements OnInit {

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

  ngOnInit() : void {
    this.getQuestionsImageTrivia()
  }

  goToBreed() {
  this.router.navigate(['/trivia-breed']);
};
  
  goToQuiz() {
    this.router.navigate(['/trivia-quiz']);
  };

    getQuestionsImageTrivia(): void {
        this.firestores.getCollectionChanges<Trivia>('Trivia').subscribe(questions => {
          // console.log(questions, 'questions all')
  
          const imgQuestions = questions.filter(q => q.type === 'image');
  
          if (imgQuestions && imgQuestions.length > 0) {
            this.questionsTrivia = imgQuestions;
            this.currentQuestionIndex = 0;
            this.currentQuestion = this.questionsTrivia[0];
          }
        });
      }


  selectOption(index: number) {
    if (this.showAnswerFeedback) return;

    this.selectedOptionIndex = index;
    this.isCorrectAnswer = index === this.currentQuestion.correct;

    if (this.isCorrectAnswer) {
      this.score++;
    }

    this.showAnswerFeedback = true;

    // Avanza después de 1.5 segundos
    setTimeout(() => {
      this.nextQuestion();
    }, 1500);
  }

  nextQuestion() {
    this.currentQuestionIndex++;
    this.selectedOptionIndex = null;
    this.showAnswerFeedback = false;

    if (this.currentQuestionIndex < this.questionsTrivia.length) {
      this.currentQuestion = this.questionsTrivia[this.currentQuestionIndex];
    } else {
      // Juego terminado
      alert(`¡Juego terminado! Tu puntaje: ${this.score}/${this.questionsTrivia.length}`);
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.currentQuestion = this.questionsTrivia[0];
    }
  }

}
