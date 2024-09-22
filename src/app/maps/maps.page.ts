import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../service/firestore.service';
import { Maps } from '../interface/Maps.model';
import { ModalController } from '@ionic/angular';
import { ModalMapsPage } from '../components/modal-maps/modal-maps.page';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {
  maps:Maps[]

  constructor(
    private firestoreService: FirestoreService,
    private modalController:ModalController) { }

  ngOnInit() {
    this.loadMaps();
  }

  loadMaps() {
    this.firestoreService.getCollectionChanges<Maps>('Maps').subscribe(data => {
      this.maps = data;
      console.log('Datos cargados:', this.maps);
    });
  }

  async openModal(isEdit: boolean) {
    const modal = await this.modalController.create({
      component: ModalMapsPage,
      componentProps: { isEdit }
    });
    return await modal.present();
  }  

}
