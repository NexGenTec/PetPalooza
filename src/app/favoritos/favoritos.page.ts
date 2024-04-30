import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {
  favoriteAnimals: any[] = [];

  constructor(private storage: Storage) { }

  ngOnInit() {
    this.getFavoriteAnimals();
  }

  async getFavoriteAnimals() {
    this.favoriteAnimals = await this.storage.get('favoriteAnimals') || [];
  }

}
