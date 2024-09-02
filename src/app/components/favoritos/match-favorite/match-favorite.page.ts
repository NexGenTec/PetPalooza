import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { InfoGato } from 'src/app/interface/InfoGato.models';
import { InfoPerro } from 'src/app/interface/InfoPerro.models';
import { FirestoreService } from 'src/app/service/firestore.service';
import { StorageService } from 'src/app/service/storage.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-match-favorite',
  templateUrl: './match-favorite.page.html',
  styleUrls: ['./match-favorite.page.scss'],
})
export class MatchFavoritePage implements OnInit {
  @ViewChild('textContainer') textContainer: ElementRef;

  gatos: InfoGato[] = [];
  perros: InfoPerro[] = [];
  combinedAnimals: any[] = [];
  currentIndex: number = 0;
  isLoading: boolean = true;
  isExpanded: boolean = false;

  constructor(  
    private firestores: FirestoreService,
    private favoritesService: StorageService,
  ) { }

  ngOnInit() {
    this.loadAnimals();
  }

  async loadAnimals() {
    this.isLoading = true;
    try {
      const gatos = await firstValueFrom(this.firestores.getCollectionChanges<InfoGato>('InfoGatos'));
      const perros = await firstValueFrom(this.firestores.getCollectionChanges<InfoPerro>('InfoPerros'));
  
      const favoriteGatos = await firstValueFrom(this.favoritesService.getFavoritesByType('gato'));
      const favoritePerros = await firstValueFrom(this.favoritesService.getFavoritesByType('perro'));
  
      this.gatos = gatos.filter(gato => !favoriteGatos.some(fav => fav.id === gato.id));
      this.perros = perros.filter(perro => !favoritePerros.some(fav => fav.id === perro.id));
  
      this.combinedAnimals = this.intercalate(this.gatos, this.perros);
  
      if (this.combinedAnimals.length > 0 && this.currentIndex >= this.combinedAnimals.length) {
        this.currentIndex = 0;
      }

    } catch (error) {
      console.error('Error al cargar animales:', error);
    } finally {
      this.isLoading = false;
    }
  }
  
  intercalate(gatos: any[], perros: any[]): any[] {
    const result = [];
    const maxLength = Math.max(gatos.length, perros.length);
  
    for (let i = 0; i < maxLength; i++) {
      if (gatos[i]) {
        gatos[i].type = 'gato';
        result.push(gatos[i]);
      }
      if (perros[i]) {
        perros[i].type = 'perro';
        result.push(perros[i]);
      }
    }
    return result;
  }

  async onLike(animal: any) {
    await this.favoritesService.addToFavorites(animal, animal.type);
    this.moveToNextAnimal();
  }

  onDislike() {
    this.moveToNextAnimal();
  }

  moveToNextAnimal() {
    if (this.combinedAnimals.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.combinedAnimals.length;
    }
  }  

  getCurrentAnimal() {
    return this.combinedAnimals[this.currentIndex] || null;
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }
      
}
