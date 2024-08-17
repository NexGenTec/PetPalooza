import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {
  favoriteAnimals = [];

  constructor(private router: Router) { }
  ngOnInit(): void {
    const favoritesString = localStorage.getItem('favorites');
    if (favoritesString) {
      this.favoriteAnimals = JSON.parse(favoritesString);
      console.log(JSON.parse(favoritesString))
    }
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
}
