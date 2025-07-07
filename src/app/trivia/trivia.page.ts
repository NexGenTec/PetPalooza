import { Component, OnInit } from '@angular/core';
import { Trivia } from '../interface/Trivia.models';
import { FirestoreService } from '../service/firestore.service';
import { Router } from '@angular/router';
import { AdmobAds, BannerPosition, BannerSize, } from 'capacitor-admob-ads';
import { environment } from 'src/environments/environment.prod';



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

  isLoading:boolean = true

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
  this.isLoading = true;


  this.firestores.getCollectionChanges<Trivia>('Trivia').subscribe(questions => {
    const filteredQuestions = questions.filter(q => q.type === 'text' && q.level === level);
    // console.log(`Preguntas nivel ${level}:`, filteredQuestions);

    if (filteredQuestions.length > 0) {
      this.questionsTrivia = filteredQuestions;
      this.currentQuestionIndex = 0;
      this.currentQuestion = this.questionsTrivia[0];

      this.isLoading = false;
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

