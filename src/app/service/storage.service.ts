import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private favorites: any[] = [];

  constructor(
    private toastController: ToastController
  ) {
    this.loadFavorites();
  }

  private loadFavorites() {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      this.favorites = JSON.parse(storedFavorites);
    }
  }

  getFavorites(): any[] {
    return this.favorites;
  }

  isInFavorites(animal: any, type: string): boolean {
    return this.favorites.some(favorite => favorite.id === animal.id && favorite.type === type);
  }

  async addToFavorites(animal: any, type: string) {
    const index = this.favorites.findIndex(favorite => favorite.id === animal.id && favorite.type === type);
    if (index !== -1) {
      this.favorites.splice(index, 1);
      await this.showToast('Eliminado de favoritos', 'danger');
    } else {
      animal.type = type;
      this.favorites.push(animal);
      await this.showToast('Agregado a favoritos', 'success');
    }
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: color
    });
    toast.present();
  }
}