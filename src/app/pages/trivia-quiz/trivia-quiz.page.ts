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

  showFinalResult: boolean = false;
  finalMessage: string =  '';
  finalGif: string = '';


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

  // nextQuestion() {
  //   this.currentQuestionIndex++;
  //   this.selectedOptionIndex = null;
  //   this.showAnswerFeedback = false;

  //   if (this.currentQuestionIndex < this.questionsTrivia.length) {
  //     this.currentQuestion = this.questionsTrivia[this.currentQuestionIndex];
  //   } else {
  //     // Juego terminado
  //     alert(`¡Juego terminado! Tu puntaje: ${this.score}/${this.questionsTrivia.length}`);
  //     this.currentQuestionIndex = 0;
  //     this.score = 0;
  //     this.currentQuestion = this.questionsTrivia[0];
  //   }
  // }
nextQuestion(){
   this.currentQuestionIndex++;
    this.selectedOptionIndex = null;
    this.showAnswerFeedback = false;

  if(this.currentQuestionIndex < this.questionsTrivia.length){
    this.currentQuestion = this.questionsTrivia[this.currentQuestionIndex];
  }else {
    //Mostrar resultado
    this.showFinalResult = true;
    this.generateFinalMessage();
  }
};

generateFinalMessage(){
  const total = this.questionsTrivia.length;
  const percent = (this.score / total) * 100;

    if (percent === 100) {
    this.finalMessage = '🎉 ¡Perfecto! Eres un experto en mascotas. ¡Felicidades!';
    this.finalGif= 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnRyeTl6YnIzemFmZ2owdjVvZW85M3NsNmpucnNuc2V2MWwyZW5uOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/13CoXDiaCcCoyk/giphy.gif'
  } else if (percent >= 75) {
    this.finalMessage = '👏 ¡Muy bien! Sabes bastante sobre perros y gatos.';
    this.finalGif= 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3NicnRveTNpMWt4aHVlcnIza3dpcTQ2ZTRuY2IzcTJzczJubmJwaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JIX9t2j0ZTN9S/giphy.gif'
  } else if (percent >= 50) {
    this.finalMessage = '😺 Nada mal, ¡pero puedes mejorar!';
    this.finalGif= 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2l4bXl3emdqYnZnZXQ1Znl2bml1amN6b2UzOHY1ZGNzNGRuanFndiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/FY8c5SKwiNf1EtZKGs/giphy.gif'
  } else {
    this.finalMessage = '🐾 Aún puedes aprender mucho más sobre mascotas. ¡Sigue intentándolo!';
    this.finalGif= 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXhqejc4M2QyZ2IwenQxa3dnazRzMHlqaHYzZDh4YWp4YWl5NjA2aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/5bgS90uCmWoWp2hBvj/giphy.gif'
  }
};


restartQuiz() {
  this.score = 0;
  this.currentQuestionIndex = 0;
  this.currentQuestion = this.questionsTrivia[0];
  this.showFinalResult = false;
  this.selectedOptionIndex = null;
  this.showAnswerFeedback = false;
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

