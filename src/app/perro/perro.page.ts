import { Component } from '@angular/core';
import { InfoPerro } from '../interface/InfoPerro.models';
import { QuirkyFacts } from '../interface/QuirkyFacts.models';
import { FirestoreService } from '../service/firestore.service';

@Component({
  selector: 'app-perro',
  templateUrl: 'perro.page.html',
  styleUrls: ['perro.page.scss']
})
export class perroPage {
  perros: InfoPerro[] = [];
  DatosFreak: QuirkyFacts[] = [];
  currentDatoIndex: number = 0;


  constructor(private firestores: FirestoreService) {
    this.loadData()
  }


  ngOnInit(): void {
    this.getQuirkyFacts();
    setInterval(() => {
      this.showRandomQuirkyFact();
    }, 10000);
  }

  loadData() {
    this.firestores.getCollectionChanges<InfoPerro>('InfoPerro').subscribe(perro => {
      if (perro) {
        this.perros = perro
      }
    })
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
    this.currentDatoIndex = randomIndex;
  }
}
