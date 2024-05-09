
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../service/firestore.service';
import { InfoGato } from '../interface/InfoGato.models';
import { InfoPerro } from '../interface/InfoPerro.models';
import { QuirkyFacts } from '../interface/QuirkyFacts.models';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class homePage implements OnInit {

  gatos: InfoGato[] = [];
  perros: InfoPerro[] = [];

  DatosFreak: QuirkyFacts[] = [];
  currentDatoIndex: number = 0;

  currentView: string = 'Últimos';



  constructor(
    private router: Router,
    private firestores: FirestoreService,
  ) {
    this.loadData();
  }

  ngOnInit(): void {
    this.getQuirkyFacts();
    setInterval(() => {
      this.showRandomQuirkyFact();
    }, 10000);
  }

  loadData() {
    this.firestores.getCollectionChanges<InfoGato>('InfoGato').subscribe(gato => {
      if (gato) {
        this.gatos = gato
      }
    })
    this.firestores.getCollectionChanges<InfoPerro>('InfoPerro').subscribe(perro => {
      if (perro) {
        this.perros = perro
      }
    })
  }

  toggleView(view: string) {
    this.currentView = view;
  }

  getQuirkyFacts() {
    this.firestores.getCollectionChanges<QuirkyFacts>('QuirkyFacts').subscribe(dato => {
      if (dato) {
        this.DatosFreak = dato;
        this.showRandomQuirkyFact();
      }
    });
  }

  showRandomQuirkyFact() {
    const randomIndex = Math.floor(Math.random() * this.DatosFreak.length);
    // console.log("Dato Freak actual:", this.DatosFreak[randomIndex]?.id);
    this.currentDatoIndex = randomIndex;
  }

  navigateToCat() {
    this.router.navigate(['/tabs/gato']);
  }


  navigateToDog() {
    this.router.navigate(['/tabs/perro']);
  }

  navigateToFavorites() {
    this.router.navigate(['/favoritos']);
  }


  animateHearts() {
    const hearts = document.querySelectorAll('.heart-icon');
    hearts.forEach((heart, index) => {
      setTimeout(() => {
        heart.classList.add('exploding-heart');
        setTimeout(() => {
          heart.classList.remove('exploding-heart');
        }, 1000);
      }, index * 1000);
    });
  }
}
