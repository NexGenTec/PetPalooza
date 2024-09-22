import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../service/firestore.service';
import { Maps } from '../../interface/Maps.model';
import { ModalController, AlertController } from '@ionic/angular';
import { ModalMapsPage } from './modal-maps/modal-maps.page';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {
  maps: Maps[];

  constructor(
    private firestoreService: FirestoreService,
    private modalController: ModalController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.loadMaps();
  }

  loadMaps() {
    this.firestoreService.getCollectionChanges<Maps>('Maps').subscribe(data => {
      this.maps = data;
      console.log('Datos cargados:', this.maps);
    });
  }

  async openModal(isEdit: boolean, map?: Maps) {
    const modal = await this.modalController.create({
      component: ModalMapsPage,
      componentProps: { isEdit, map }
    });
    return await modal.present();
  }  

  async presentAlertConfirm(mapId: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      mode:'ios',
      message: '¿Estás seguro de que deseas eliminar este lugar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteMap(mapId);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteMap(mapId: string) {
    try {
      await this.firestoreService.deleteDocument('Maps', mapId);
      console.log('Documento eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar el documento:', error);
    }
  }
}
