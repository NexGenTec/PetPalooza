import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../service/firestore.service';
import { InfoGato } from 'src/app/interface/InfoGato.models';
import { InfoPerro } from 'src/app/interface/InfoPerro.models';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-img-users',
  templateUrl: './img-users.page.html',
  styleUrls: ['./img-users.page.scss'],
})
export class ImgUsersPage implements OnInit {

  infoGatos:InfoGato[]
  infoPerros:InfoPerro[]

  constructor(
    private firestoreService: FirestoreService,
    private alertController: AlertController,
    private toastController: ToastController ) { }

  ngOnInit() {
    this.loadInfo();
  }

  loadInfo() {
    this.firestoreService.getCollectionChanges<InfoGato>('InfoGatos').subscribe(data => {
      this.infoGatos = data.map(gato => {
        gato.ImgUsers = gato.ImgUsers?.map(imgUser => ({
          id: imgUser.id,
          ...imgUser
      })) || [];
      return gato;
    });
    console.log('Datos cargados:', this.infoGatos);
    });
    this.firestoreService.getCollectionChanges<InfoPerro>('InfoPerros').subscribe(data => {
      this.infoPerros = data.map(perro => {
          perro.ImgUsers = perro.ImgUsers?.map(imgUser => ({
              id: imgUser.id,
              ...imgUser
          })) || [];
          return perro;
      });
      console.log('Datos de perros cargados:', this.infoPerros);
    });
  }

  async DeleteAlert(gatoId: string, imgUserId: string, tipo: string) {
    const alert = await this.alertController.create({
      header: 'Eliminar imagen',
      mode:'ios',
      message: '¿Estás seguro de que deseas eliminar esta imagen?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteImage(gatoId, imgUserId, tipo);
          }
        }
      ]
    });

    await alert.present();
  }
  async deleteImage(animalId: string, imgUserId: string, tipo: string) {
    console.log('ID de la imagen a eliminar:', imgUserId); // Verifica que imgUserId no sea undefined
    if (!imgUserId) {
      console.error('No se proporcionó un ID válido para la imagen.');
      return;
    }

    try {
      if (tipo === 'gato') {
        await this.firestoreService.deleteDocument(`InfoGatos/${animalId}/ImgUsers`, imgUserId);
        console.log('Imagen de gato eliminada correctamente');
        this.loadInfo();
        this.presentToast('Imagen de gato eliminada correctamente', 'success'); // Mostrar toast al eliminar
      } else if (tipo === 'perro') {
        await this.firestoreService.deleteDocument(`InfoPerros/${animalId}/ImgUsers`, imgUserId);
        console.log('Imagen de perro eliminada correctamente');
        this.loadInfo();
        this.presentToast('Imagen de perro eliminada correctamente', 'success'); // Mostrar toast al eliminar
      }
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      this.presentToast('Error al eliminar la imagen', 'danger'); // Mostrar toast en caso de error
    }
  }

  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
