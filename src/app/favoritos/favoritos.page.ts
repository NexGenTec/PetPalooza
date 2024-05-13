import { Component, OnInit } from '@angular/core';
import { InfoPerro } from '../interface/InfoPerro.models';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {
  favoriteAnimals: InfoPerro[] = [];

  constructor() { }
  ngOnInit(): void {
    const favoritesString = localStorage.getItem('favorites');
    if (favoritesString) {
      this.favoriteAnimals = JSON.parse(favoritesString);
    }
  }

  removeFromFavorites(animal: InfoPerro) {
    const index = this.favoriteAnimals.findIndex(a => a === animal);
    if (index !== -1) {
      this.favoriteAnimals.splice(index, 1);
      localStorage.setItem('favorites', JSON.stringify(this.favoriteAnimals));
    }
  }
}
