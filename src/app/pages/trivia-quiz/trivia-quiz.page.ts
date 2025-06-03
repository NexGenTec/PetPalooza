import { Component, OnInit } from '@angular/core';
import { Trivia } from '../../interface/Trivia.models';
import { FirestoreService } from '../../service/firestore.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AdmobAds, BannerPosition, BannerSize, } from 'capacitor-admob-ads';
import { environment } from 'src/environments/environment.prod';


@Component({
  selector: 'app-trivia-quiz',
  templateUrl: './trivia-quiz.page.html',
  styleUrls: ['./trivia-quiz.page.scss'],
})
export class TriviaQuizPage implements OnInit {

  questionsTrivia: Trivia[] = [];
  currentQuestionIndex: number = 0;
  currentQuestion!: Trivia;
  selectedOptionIndex: number | null = null;
  showAnswerFeedback : boolean = false;
  isCorrectAnswer: boolean = false;
  score: number = 0;


  constructor(
    private route: ActivatedRoute,
    private firestores : FirestoreService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const level = params['level'] || 'basic';
      this.getQuestionsTrivia(level);

    });
  }


goToBreed() {
  this.router.navigate(['/trivia-breed']);
};
  
goToQuiz() {
  this.router.navigate(['/trivia-quiz']);
};

  getQuestionsTrivia(level:string): void {
      this.firestores.getCollectionChanges<Trivia>('Trivia').subscribe(questions => {
        // console.log(questions, 'questions all')

        const textQuestions = questions.filter(q => q.type === 'text' && q.level === level);
        // console.log(textQuestions, 'questions')

        if (textQuestions && textQuestions.length > 0) {
          this.questionsTrivia = textQuestions;
          this.currentQuestionIndex = 0;
          this.currentQuestion = this.questionsTrivia[0];
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

    // Avanza después de 1.8 segundos
    setTimeout(() => {
      this.nextQuestion();
    }, 1800);
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


    /*Anuncio Banner  */
  async showAdaptiveBanner() {
    try {
      await AdmobAds.showBannerAd({
        adId: environment.adId,
        isTesting: false,
        adSize: BannerSize.FULL_BANNER,
        adPosition: BannerPosition.TOP
      });
      console.log('Banner adaptable (Full Banner) mostrado correctamente');

      // Cerrar el banner después de cierto tiempo o evento
      setTimeout(async () => {
        try {
          await AdmobAds.removeBannerAd();
          console.log('Banner adaptable (Full Banner) cerrado correctamente');
        } catch (error) {
          console.error('Error al cerrar el banner adaptable (Full Banner)', error);
        }
      }, 10000); // Ejemplo: cerrar el banner después de 10 segundos
    } catch (error) {
      console.error('Error al mostrar el banner adaptable (Full Banner)', error);
    }
  }
}

