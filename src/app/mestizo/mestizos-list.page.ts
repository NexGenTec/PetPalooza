import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mestizos-list',
  templateUrl: './mestizos-list.page.html',
  styleUrls: ['./mestizos-list.page.scss'],
})
export class MestizosListPage implements OnInit {
  
  // gatos: InfoGato[] = [];
  // filteredGatos: InfoGato[] = [];
  favorites: any[] = [];
  currentDatoIndex: number = 0;
  searchTerm: string = '';
  isLoading = true;


  constructor(
  ) {
    this.loadData();
  }


  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

  loadData() {
    // this.firestores.getCollectionChanges<InfoGato>('InfoGatos').subscribe(gato => {
    //   if (gato) {
    //     this.gatos = gato
    //     this.filteredGatos = [...this.gatos];
    //     this.isLoading = false;
    //   }
    // })
  }
}
