import { Component, OnInit } from '@angular/core';
import { InfoGato } from '../../interface/InfoGato.models';
import { QuirkyFacts } from '../../interface/QuirkyFacts.models';
import { FirestoreService } from '../../service/firestore.service';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-gato',
  templateUrl: 'gato.page.html',
  styleUrls: ['gato.page.scss']
})
export class gatoPage implements OnInit {

  gatos: InfoGato[] = [];
  DatosFreak: QuirkyFacts[] = [];
  filteredGatos: InfoGato[] = [];
  favorites: any[] = [];
  currentDatoIndex: number = 0;
  searchTerm: string = '';


  constructor(
    private firestores: FirestoreService,
    private router: Router,
    private toastController: ToastController
  ) {
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
        this.filteredGatos = [...this.gatos];
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

  isInFavorites(animal: any, type: string): boolean {
    const favorites: any[] = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.some(favorite => favorite.id === animal.id && favorite.type === type);
  }

  async addToFavorites(animal: any, type: string) {
    let favorites: any[] = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favorites.findIndex(favorite => favorite.id === animal.id && favorite.type === type);
    if (index !== -1) {
      favorites.splice(index, 1);
      const toast = await this.toastController.create({
        message: 'Eliminado de favoritos',
        duration: 2000,
        position: 'top',
        color: 'danger'
      });
      toast.present();
    } else {
      animal.type = type;
      favorites.push(animal);
      const toast = await this.toastController.create({
        message: 'Agregado a favoritos',
        duration: 2000,
        position: 'top',
        color: 'success'
      });
      toast.present();
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    this.favorites = favorites;
  }
}
