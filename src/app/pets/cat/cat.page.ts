import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InfoGato } from 'src/app/interface/InfoGato.models';
import { FirestoreService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-cat',
  templateUrl: './cat.page.html',
  styleUrls: ['./cat.page.scss'],
})
export class CatPage implements OnInit {

  gatos: InfoGato[] = [];
  filteredGatos: InfoGato[] = [];
  favorites: any[] = [];
  currentDatoIndex: number = 0;
  searchTerm: string = '';


  constructor(
    private firestores: FirestoreService,
    private router: Router,
  ) {
    this.loadData();
  }


  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.firestores.getCollectionChanges<InfoGato>('InfoGato').subscribe(gato => {
      if (gato) {
        this.gatos = gato
        this.filteredGatos = [...this.gatos];
      }
    })
  }

  navigateToTargetPage(segment: string, gato: InfoGato) {
    this.router.navigate([segment, gato.id], { state: { data: gato } });
  }

  filterGatos() {
    console.log('Search term:', this.searchTerm);
    this.filteredGatos = this.gatos.filter(gato =>
      gato.Raza.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    console.log('Filtered gatos:', this.filteredGatos);
  }
}