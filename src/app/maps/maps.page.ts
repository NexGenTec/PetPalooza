import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../service/firestore.service';
import { Maps } from '../interface/Maps.model';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {
  maps:Maps[]

  constructor(
    private firestoreService: FirestoreService) { }

  ngOnInit() {
    this.loadMaps();
  }

  loadMaps() {
    this.firestoreService.getCollectionChanges<Maps>('Maps').subscribe(data => {
      this.maps = data;
      console.log('Datos cargados:', this.maps);
    });
  }

}
