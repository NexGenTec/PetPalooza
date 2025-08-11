import { Component, OnInit } from '@angular/core';
import { Trivia } from '../../interface/Trivia.models';
import { TriviaResult } from '../../interface/TriviaResult.models';
import { FirestoreService } from '../../service/firestore.service';
import { ActivatedRoute,Router } from '@angular/router';
import { AdmobAds, BannerPosition, BannerSize, } from 'capacitor-admob-ads';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-trivia-breed',
  templateUrl: './trivia-breed.page.html',
  styleUrls: ['./trivia-breed.page.scss'],
})
export class TriviaBreedPage implements OnInit {

  questionsTrivia: Trivia[] = [];
  resultsList: TriviaResult[] = [];
  currentQuestionIndex: number = 0;
  currentQuestion!: Trivia;
  selectedOptionIndex: number | null = null;
  showAnswerFeedback : boolean = false;
  isCorrectAnswer: boolean = false;
  score: number = 0;

  showFinalResult: boolean = false;
  finalMessage: string = '';
  finalGif: string = '';

  isLoading:boolean = true;
  animate: boolean = false;




  constructor(
      private route: ActivatedRoute,
      private firestores : FirestoreService,
      private router: Router,
  ) { }

  ngOnInit() : void {
    this.route.queryParams.subscribe(params => {
      const level = params['level']|| 'basic';
      this.getQuestionsImageTrivia(level)
      
    })
  }

  goToBreed() {
  this.router.navigate(['/trivia-breed']);
};
  
  goToQuiz() {
    this.router.navigate(['/trivia-quiz']);
  };


  // loadQuestion() {
  // this.isLoading = true;
  // console.log('Carga terminada, isLoading:', this.isLoading);
  // setTimeout(() => {
  //       this.currentQuestionIndex++;
  //       this.currentQuestion = this.questionsTrivia[this.currentQuestionIndex];
  //       this.isLoading = false;
  //     }, 400); // Pequeña pausa para mostrar el loader (opcional)
  //   }

    

  randomArray(array : any []){
  for (let i = array.length - 1; i > 0; i--){
    const j =Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

  getQuestionsImageTrivia(level:string): void {
        this.isLoading = true;

        this.firestores.getCollectionChanges<Trivia>('Trivia').subscribe(questions => {
          // console.log(questions, 'questions all')
  
          const imgQuestions = questions.filter(q => q.type === 'image' && q.level === level);
  
          if (imgQuestions && imgQuestions.length > 0) {

            const shuffled = this.randomArray([...imgQuestions]);
            const selected = shuffled.slice(0, 6);

            this.questionsTrivia = selected;
            this.currentQuestionIndex = 0;
            this.currentQuestion = this.questionsTrivia[0];

            this.isLoading = false;

          }
        });
      }


  selectOption(index: number) {
    if (this.showAnswerFeedback) return;

    this.selectedOptionIndex = index;
    this.isCorrectAnswer = index === this.currentQuestion.correct;

    // Guardar resultado en el arreglo
    const selectedText = this.currentQuestion.options[index].option;
    const correctText = this.currentQuestion.options[this.currentQuestion.correct].option;

    this.resultsList.push({
      question: this.currentQuestion.question,
      image: this.currentQuestion.imageUrl,
      wasCorrect: this.isCorrectAnswer,
      selectedAnswer: selectedText,
      correctAnswer: correctText,
      explainAnswer: ''
    });

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
    this.selectedOptionIndex = null;
    this.showAnswerFeedback = false;
    this.currentQuestionIndex++;
    this.animate = false
    
          // if (this.currentQuestionIndex < this.questionsTrivia.length) {
          //   this.currentQuestion = this.questionsTrivia[this.currentQuestionIndex];
          // }else {
          //   // Juego terminado
          //   this.showFinalResult = true;
          //   this.generateFinalMessage();
          // }
      setTimeout(() => {
            
            if (this.currentQuestionIndex < this.questionsTrivia.length) {
            this.currentQuestion = this.questionsTrivia[this.currentQuestionIndex];
            // this.currentQuestionIndex++;

            this.animate = true;
          }else {
            // Juego terminado
            this.showFinalResult = true;
            this.generateFinalMessage();
          }

      }, 50);
  }

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
  this.resultsList = [];

 const level = this.route.snapshot.queryParamMap.get('level') || 'basic';
 this.getQuestionsImageTrivia(level);
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
      }, 12000); // Ejemplo: cerrar el banner después de 10 segundos
    } catch (error) {
      console.error('Error al mostrar el banner adaptable (Full Banner)', error);
    }
  }

}
