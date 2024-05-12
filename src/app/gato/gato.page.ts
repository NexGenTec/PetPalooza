import { Component, OnInit } from '@angular/core';
import { InfoGato } from '../interface/InfoGato.models';
import { QuirkyFacts } from '../interface/QuirkyFacts.models';
import { FirestoreService } from '../service/firestore.service';
@Component({
  selector: 'app-gato',
  templateUrl: 'gato.page.html',
  styleUrls: ['gato.page.scss']
})
export class gatoPage implements OnInit {

  gatos: InfoGato[] = [];
  DatosFreak: QuirkyFacts[] = [];
  currentDatoIndex: number = 0;


  constructor(private firestores: FirestoreService) {
    this.loadData();
  }


  ngOnInit(): void {
    this.getQuirkyFacts();
    setInterval(() => {
      this.showRandomQuirkyFact();
    }, 10000);
    this.loadData();
  }

  loadData() {
    this.firestores.getCollectionChanges<InfoGato>('InfoGato').subscribe(gato => {
      if (gato) {
        this.gatos = gato
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
