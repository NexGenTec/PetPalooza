import { Component, OnInit } from '@angular/core';
import { QuirkyFacts } from '../../interface/QuirkyFacts.models';
import { FirestoreService } from '../../service/firestore.service';

@Component({
  selector: 'app-aves',
  templateUrl: './aves.page.html',
  styleUrls: ['./aves.page.scss'],
})
export class AvesPage implements OnInit {

  DatosFreak: QuirkyFacts[] = [];
  currentDatoIndex: number = 0;

  breakpointsRegisteredAnimals = {
    0: { slidesPerView: 1.15 },
    340: { slidesPerView: 2.15 },
    480: { slidesPerView: 3.15 },
    640: { slidesPerView: 4.15 },
    768: { slidesPerView: 5.15 },
  };

  constructor(
    private firestores: FirestoreService,
  ) { }

  ngOnInit() {
    this.getQuirkyFacts();
    setInterval(() => {
      this.showRandomQuirkyFact();
    }, 10000);
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
    const perroIndices = this.DatosFreak.map((fact, index) => {
      return fact.categoria === 'perro' ? index : null;
    }).filter(index => index !== null);

    if (perroIndices.length > 0) {
      const randomIndex = perroIndices[Math.floor(Math.random() * perroIndices.length)];
      this.currentDatoIndex = randomIndex;
    } else {
      console.log("No hay datos disponibles con la categoría Gato");
    }
  }

}
