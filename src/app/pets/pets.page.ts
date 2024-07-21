import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../service/firestore.service';
import { InfoGato } from '../interface/InfoGato.models';
import { InfoPerro } from '../interface/InfoPerro.models';

@Component({
  selector: 'app-pets',
  templateUrl: './pets.page.html',
  styleUrls: ['./pets.page.scss'],
})
export class PetsPage implements OnInit {
  originalGatos: InfoGato[] = [];
  originalPerros: InfoPerro[] = [];

  constructor(private router: Router,
    private firestores: FirestoreService,
  ) {}

  goToPage(page: string) {
    this.router.navigate([`/pets/${page}`]);
  }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.firestores.getCollectionChanges<InfoGato>('InfoGatos').subscribe(gatos => {
      if (gatos) {
        this.originalGatos = gatos;
      }
    });

    this.firestores.getCollectionChanges<InfoPerro>('InfoPerros').subscribe(perros => {
      if (perros) {
        this.originalPerros = perros;
      }
    });
  }

}
