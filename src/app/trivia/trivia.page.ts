import { Component, OnInit } from '@angular/core';
import { Trivia } from '../interface/Trivia.models';
import { FirestoreService } from '../service/firestore.service';


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
    private firestores : FirestoreService
  ) { }

  ngOnInit(): void {
    this.getQuestionsTrivia();
  }

  

  getQuestionsTrivia(): void {
      this.firestores.getCollectionChanges<Trivia>('Trivia').subscribe(questions => {
        console.log('Preguntas :', questions)
        if (questions && questions.length > 0) {
          this.questionsTrivia = questions;
          this.currentQuestion = questions[0]
          // this.showRandomQuirkyFact();
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

