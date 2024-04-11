import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.page.html',
  styleUrls: ['./search-modal.page.scss'],
})
export class SearchModalPage implements OnInit {

  @Input() razas!: any[];
  filteredRazas: any[] = [];

  constructor(private modalController: ModalController) { }

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


}
