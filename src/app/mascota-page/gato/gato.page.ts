import { Component, OnInit } from '@angular/core';
import { InfoGato } from '../../interface/InfoGato.models';
import { QuirkyFacts } from '../../interface/QuirkyFacts.models';
import { FirestoreService } from '../../service/firestore.service';
import { Router } from '@angular/router';
import { Platform, ToastController } from '@ionic/angular';
import { StorageService } from 'src/app/service/storage.service';
import { ActionPerformed, PushNotifications } from '@capacitor/push-notifications';

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
  gatoId: string | null = null;


  constructor(
    private firestores: FirestoreService,
    private router: Router,
    private favoritesService: StorageService,
    private platform: Platform
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
    this.firestores.getCollectionChanges<InfoGato>('InfoGatos').subscribe(gato => {
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
    this.filteredGatos = this.gatos.filter(gato =>
      gato.Raza.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  isInFavorites(animal: any, type: string): boolean {
    return this.favoritesService.isInFavorites(animal, type);
  }

  async addToFavorites(animal: any, type: string) {
    await this.favoritesService.addToFavorites(animal, type);
    this.loadFavorites();  // Actualizar la lista de favoritos después de agregar o eliminar
  }

  private loadFavorites() {
    this.favorites = this.favoritesService.getFavorites();
  }
}