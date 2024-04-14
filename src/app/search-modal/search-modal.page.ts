import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.page.html',
  styleUrls: ['./search-modal.page.scss'],
})
export class SearchModalPage implements OnInit {

  @Input() razas!: any[];
  filteredRazas: any[] = [];
  @Input() tipo!: string;

  constructor(private modalController: ModalController, private router: Router) { }

  ngOnInit() {
    this.filteredRazas = this.razas;
  }

  dismiss() {
    this.modalController.dismiss();
  }

  filterBreeds(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredRazas = this.razas.filter((raza: any) =>
      raza.Raza.toLowerCase().includes(searchTerm)
    );
  }

  navigateToProfile(id: string) {
    if (this.tipo === 'perro') {
      this.router.navigate(['/perfil-perro', id]).then(() => {
        this.dismiss();
      });
    } else if (this.tipo === 'gato') {
      this.router.navigate(['/perfil-gato', id]).then(() => {
        this.dismiss();
      });
    }
  }
}
