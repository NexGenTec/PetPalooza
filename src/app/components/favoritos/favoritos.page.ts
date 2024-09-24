import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../service/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {
  favoriteAnimals = [];
  isLoading: boolean = true;
  skeletonCategories = Array(4);
  skeletonFavorites = Array(6); 
  favorites: any[] = [];
  loaded: boolean = false;

  constructor(
    private router: Router,
    private favoritesService: StorageService,
  ) { }
  ngOnInit(): void {
    setTimeout(() => {
      this.loadFavorites();
      this.loaded = true;
    }, 3000);
    const favoritesString = localStorage.getItem('favorites');
    if (favoritesString) {
      this.favoriteAnimals = JSON.parse(favoritesString);
    }
    this.simulateLoading();
  }

  navigateToAnimalProfile(animal: any) {
    if (animal.type === 'perro') {
      this.router.navigate(['/perfil-perro', animal.id], { state: { data: animal } });
    } else if (animal.type === 'gato') {
      this.router.navigate(['/perfil-gato', animal.id], { state: { data: animal } });
    } else {
      console.error('Tipo de animal no válido:', animal.type);
    }
  }

  simulateLoading() {
    setTimeout(() => {
      this.isLoading = false;  // Simula la carga completada
    }, 3000);  // Simula un tiempo de carga
  }

  private loadFavorites() {
    this.favoriteAnimals = this.favoritesService.getFavorites();
  }
  toggleFavorite(animal: any, type: string) {
    this.favoritesService.addToFavorites(animal, type);
    this.loadFavorites(); // Recargar favoritos para reflejar los cambios en la vista
  }

  isInFavorites(animal: any, type: string): boolean {
    return this.favoritesService.isInFavorites(animal, type);
  }

  navigateToFavoriteMatch() {
    this.router.navigate(['/favoritos/match-favorite']);
  }  
}
