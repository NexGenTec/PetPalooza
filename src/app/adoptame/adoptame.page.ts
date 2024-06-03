import { Component, OnInit } from '@angular/core';
import { QuirkyFacts } from '../interface/QuirkyFacts.models';
import { FirestoreService } from '../service/firestore.service';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-adoptame',
  templateUrl: './adoptame.page.html',
  styleUrls: ['./adoptame.page.scss'],
})
export class AdoptamePage implements OnInit {

  DatosFreak: QuirkyFacts[] = [];
  currentDatoIndex: number = 0;

  constructor(private firestores: FirestoreService,
    private router: Router,
    private toastController: ToastController
  ) {
  }

  ngOnInit(): void {
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
    const gatoIndices = this.DatosFreak.map((fact, index) => {
      return fact.categoria === 'gato' ? index : null;
    }).filter(index => index !== null);

    if (gatoIndices.length > 0) {
      const randomIndex = gatoIndices[Math.floor(Math.random() * gatoIndices.length)];
      this.currentDatoIndex = randomIndex;
    } else {
      console.log("No hay datos disponibles con la categoría Gato");
    }
  }

}
