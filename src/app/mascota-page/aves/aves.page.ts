import { Component, OnInit } from '@angular/core';
import { InfoAve } from 'src/app/interface/InfoAve.models';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-aves',
  templateUrl: './aves.page.html',
  styleUrls: ['./aves.page.scss'],
})
export class AvesPage implements OnInit {

  aves: InfoAve[] = [];
  filteredAves: { [key: string]: InfoAve[] } = {};

  breakpointsRegisteredAnimals = {
    0: { slidesPerView: 1.15 },
    340: { slidesPerView: 2.15 },
    480: { slidesPerView: 3.15 },
    640: { slidesPerView: 4.15 },
    768: { slidesPerView: 5.15 },
  };

  constructor(
    private router: Router,
    private firestores: FirestoreService,
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.firestores.getCollectionChanges<InfoAve>('InfoAve').subscribe(aves => {
      if (aves) {
        this.aves = aves;
        // Filtrar aves por categoría
        this.aves.forEach(ave => {
          if (!this.filteredAves[ave.categoria]) {
            this.filteredAves[ave.categoria] = [];
          }
          this.filteredAves[ave.categoria].push(ave);
        });
        console.log(this.filteredAves);
        console.log(this.filteredAves['Exhibicion']);
        console.log(this.filteredAves['Otros-Usos']);
        console.log(this.filteredAves['Produccion']);
      }
    });
  }
  navigateToPageAve(ave: InfoAve) {
    this.router.navigate(['page-ave', ave.categoria, { info: JSON.stringify(ave) }]);
  }
}
