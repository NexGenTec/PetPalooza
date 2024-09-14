import { Component, OnDestroy } from '@angular/core';
import { InfoPerro } from '../../interface/InfoPerro.models';
import { QuirkyFacts } from '../../interface/QuirkyFacts.models';
import { FirestoreService } from '../../service/firestore.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-perro',
  templateUrl: 'perro.page.html',
  styleUrls: ['perro.page.scss']
})
export class perroPage implements OnDestroy {

  perros: InfoPerro[] = [];
  DatosFreak: QuirkyFacts[] = [];
  filteredPerros: InfoPerro[] = [];
  favorites: any[] = [];
  currentDatoIndex: number = 0;
  searchTerm: string = '';
  perroId: string | null = null;
  isLoading = true;
  private factInterval: any;

  constructor(
    private firestores: FirestoreService,
    private router: Router,
    private favoritesService: StorageService,
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.getQuirkyFacts();
    this.factInterval = setInterval(() => {
      this.showRandomQuirkyFact();
    }, 10000);  // Cambia el dato curioso cada 10 segundos
  }

  ngOnDestroy(): void {
    // Cancelar el intervalo para evitar fugas de memoria
    if (this.factInterval) {
      clearInterval(this.factInterval);
    }
  }

  loadData() {
    this.firestores.getCollectionChanges<InfoPerro>('InfoPerros').subscribe(perro => {
      if (perro) {
        this.perros = perro;
        this.filteredPerros = [...this.perros];
        this.isLoading = false;
      }
    });
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
      console.log("No hay datos disponibles con la categoría 'perro'.");
    }
  }

  navigateToTargetPage(segment: string, perro: InfoPerro) {
    this.router.navigate([segment, perro.id], { state: { data: perro } });
  }

  filterPerros() {
    const term = this.searchTerm.trim();
    if (term) {
      const regex = new RegExp(term, 'i');
      this.filteredPerros = this.perros.filter(perro => regex.test(perro.Raza));
    } else {
      this.filteredPerros = [...this.perros];
    }
  }

  isInFavorites(animal: InfoPerro, type: string): boolean {
    return this.favoritesService.isInFavorites(animal, type);
  }

  async addToFavorites(animal: InfoPerro, type: string) {
    if (!this.isInFavorites(animal, type)) {
      await this.favoritesService.addToFavorites(animal, type);
      this.loadFavorites();
    }
  }

  private loadFavorites() {
    this.favorites = this.favoritesService.getFavorites();
  }
}
