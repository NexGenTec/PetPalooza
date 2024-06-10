import { Component, OnInit } from '@angular/core';
import { Patrocinadores } from '../interface/Patrocinadores.models';
import { FirestoreService } from '../service/firestore.service';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-adoptame',
  templateUrl: './adoptame.page.html',
  styleUrls: ['./adoptame.page.scss'],
})
export class AdoptamePage implements OnInit {

  Patrocinadores: Patrocinadores[] = [];
  currentDatoIndex: number = 0;

  colorsCards = [
    { id: 1, bg: '#FFEBE5', text: '#7e402d' },
    { id: 2, bg: '#FDF1DB', text: '#6e5628' },
    { id: 3, bg: '#CFECFF', text: '#215a80' }
  ];

  constructor(private firestores: FirestoreService,
    private router: Router,
    private toastController: ToastController
  ) {
  }

  ngOnInit(): void {
    this.getQuirkyFacts();
    setInterval(() => {
    }, 10000);
  }

  getQuirkyFacts() {
    this.firestores.getCollectionChanges<Patrocinadores>('Patrocinadores').subscribe(dato => {
      if (dato) {
        this.Patrocinadores = dato;
        console.log(this.Patrocinadores)
      }
    });
  }

}
