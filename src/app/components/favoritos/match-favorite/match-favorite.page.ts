import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { InfoGato } from 'src/app/interface/InfoGato.models';
import { InfoPerro } from 'src/app/interface/InfoPerro.models';
import { FirestoreService } from 'src/app/service/firestore.service';
import { StorageService } from 'src/app/service/storage.service';
import { firstValueFrom } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ConfettiService } from 'src/app/animaciones/confetti.service';
import { InteractionService } from 'src/app/service/interaction.service';
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
  hasLikedAnimal: boolean = false;

  constructor(
    private router: Router,
    private firestores: FirestoreService,
    private favoritesService: StorageService,
    private confettiService: ConfettiService,
    private interactionService: InteractionService 
  ) {}

  ngOnInit() {
    this.loadAnimals();
    this.interactionService.likeAction$.subscribe((hasLiked) => {
      if (hasLiked) {
        this.loadAnimals();
        this.interactionService.resetLike();
      }
    });
  }

  ionViewWillEnter() {
    if (this.hasLikedAnimal) {
      this.loadAnimals();
      this.hasLikedAnimal = false;
    }
  }

  navigateToAnimalProfile(animal: any) {
    const navigationExtras: NavigationExtras = {
      state: { animal: animal, hasLiked: this.hasLikedAnimal }
    };
    if (animal.type === 'perro') {
      this.router.navigate(['/perfil-perro', animal.id], { state: { data: animal } });
    } else if (animal.type === 'gato') {
      this.router.navigate(['/perfil-gato', animal.id], { state: { data: animal } });
    } else {
      console.error('Tipo de animal no válido:', animal.type);
    }
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
    const remainingGatos = [...gatos];  // Copia de la lista original de gatos
    const remainingPerros = [...perros]; // Copia de la lista original de perros
  
    while (remainingGatos.length > 0 || remainingPerros.length > 0) {
      const shouldPickGato = Math.random() < 0.5; // 50% de probabilidad para gatos o perros
  
      if (shouldPickGato && remainingGatos.length > 0) {
        const randomIndex = Math.floor(Math.random() * remainingGatos.length);
        const gato = remainingGatos.splice(randomIndex, 1)[0]; // Eliminar el gato seleccionado
        gato.type = 'gato';
        result.push(gato);
      } else if (remainingPerros.length > 0) {
        const randomIndex = Math.floor(Math.random() * remainingPerros.length);
        const perro = remainingPerros.splice(randomIndex, 1)[0]; // Eliminar el perro seleccionado
        perro.type = 'perro';
        result.push(perro);
      }
    }
  
    return result;
  }  

  async onLike(animal: any) {
    this.interactionService.triggerLike(); 
    await this.favoritesService.addToFavorites(animal, animal.type);
    this.confettiService.triggerHeartConfetti();
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