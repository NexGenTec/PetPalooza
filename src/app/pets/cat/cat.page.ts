import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InfoGato, CaracteristicasFisicas } from '../../interface/InfoGato.models';
import { FirestoreService } from '../../service/firestore.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { ModalController, ToastController } from '@ionic/angular';
import { CatModalPage } from './cat-modal/cat-modal.page';

@Component({
  selector: 'app-cat',
  templateUrl: './cat.page.html',
  styleUrls: ['./cat.page.scss'],
})
export class CatPage implements OnInit {
  gatos: InfoGato[] = [];
  searchTerm: string = '';
  filteredGatos: InfoGato[] = [];
  newGato: InfoGato = {
    cuidados: {
      Entrenamiento: '',
      Cepillado: '',
      "Chequeos preventivos": '',
      Activos: '',
      Ejercitarse: '',
      Enfermedades: ''
    },
    origen: '',
    Anio: '',
    Raza: '',
    Temperamento: [],
    Longevidad: '',
    historia: '',
    id: 0,
    imgPerfil: '',
    fechaCreacion: { seconds: 0, nanoseconds: 0 },
    img: {},
    CaractFisicas: []
  };
  imageFile: File | null = null;

  constructor(
    private router: Router,
    private firestoreService: FirestoreService,
    private storage: AngularFireStorage,
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.firestoreService.getCollectionChanges<InfoGato>('InfoGato').subscribe((filteredGatos) => {
      this.gatos = filteredGatos;
      console.log(filteredGatos);
    });
  }

  async openModal(edit: boolean, gato?: InfoGato) {
    if (edit && gato) {
      this.newGato = { ...gato };

      // Asegurar que `imgPerfil` esté configurado si existe una imagen cargada para el gato
      if (gato.imgPerfil) {
        this.imageFile = null; // Limpiar el archivo seleccionado en el modal
      }
    } else {
      this.newGato = {
        cuidados: {
          Entrenamiento: '',
          Cepillado: '',
          "Chequeos preventivos": '',
          Activos: '',
          Ejercitarse: '',
          Enfermedades: ''
        },
        origen: '',
        Anio: '',
        Raza: '',
        Temperamento: [],
        Longevidad: '',
        historia: '',
        id: 0,
        imgPerfil: '',
        fechaCreacion: { seconds: 0, nanoseconds: 0 },
        img: {},
        CaractFisicas: []
      };
      this.imageFile = null;
    }

    const modal = await this.modalController.create({
      component: CatModalPage,
      componentProps: { newGato: this.newGato, isEdit: edit },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        if (edit) {
          this.updateGato(result.data.gato);
        } else {
          this.addGato(result.data.gato);
        }
      }
    });

    return await modal.present();
  }

  addGato(newGato: InfoGato) {
    newGato.fechaCreacion = { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 };

    if (this.imageFile) {
      const filePath = `Gatos/${newGato.Raza}/${this.imageFile.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.imageFile);

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            newGato.imgPerfil = url;
            this.firestoreService.addDocument<InfoGato>('InfoGato', newGato).then(() => {
              this.resetNewGatoForm();
              this.loadData();
              this.presentToast('Gato agregado con éxito', 'success');
            }).catch((error) => {
              console.error('Error al agregar el gato:', error);
              this.presentToast('Error al agregar el gato', 'danger');
            });
          });
        })
      ).subscribe();
    } else {
      this.firestoreService.addDocument<InfoGato>('InfoGato', newGato).then(() => {
        this.resetNewGatoForm();
        this.loadData();
        this.presentToast('Gato agregado con éxito', 'success');
      }).catch((error) => {
        console.error('Error al agregar el gato:', error);
        this.presentToast('Error al agregar el gato', 'danger');
      });
    }
  }

  updateGato(updatedGato: InfoGato) {
    if (this.imageFile) {
      const filePath = `Gatos/${updatedGato.Raza}/${this.imageFile.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.imageFile);
  
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            updatedGato.imgPerfil = url;
            this.firestoreService.updateDocument<InfoGato>('InfoGato', updatedGato.id.toString(), updatedGato).then(() => {
              this.resetNewGatoForm();
              this.loadData();
              this.presentToast('Gato actualizado con éxito', 'success');
            }).catch((error) => {
              console.error('Error al actualizar el gato:', error);
              this.presentToast('Error al actualizar el gato', 'danger');
            });
          });
        })
      ).subscribe();
    } else {
      this.firestoreService.updateDocument<InfoGato>('InfoGato', updatedGato.id.toString(), updatedGato).then(() => {
        this.resetNewGatoForm();
        this.loadData();
        this.presentToast('Gato actualizado con éxito', 'success');
      }).catch((error) => {
        console.error('Error al actualizar el gato:', error);
        this.presentToast('Error al actualizar el gato', 'danger');
      });
    }
  }
  
  deleteGato(gato: InfoGato) {
    this.firestoreService.deleteDocument('InfoGato', gato.id).then(() => {
      this.loadData();
      this.presentToast('Gato eliminado con éxito', 'success');
    }).catch((error) => {
      console.error('Error al eliminar el gato:', error);
      this.presentToast('Error al eliminar el gato', 'danger');
    });
  }

  resetNewGatoForm() {
    this.newGato = {
      cuidados: {
        Entrenamiento: '',
        Cepillado: '',
        "Chequeos preventivos": '',
        Activos: '',
        Ejercitarse: '',
        Enfermedades: ''
      },
      origen: '',
      Anio: '',
      Raza: '',
      Temperamento: [],
      Longevidad: '',
      historia: '',
      id: 0,
      imgPerfil: '',
      fechaCreacion: { seconds: 0, nanoseconds: 0 },
      img: {},
      CaractFisicas: []
    };
    this.imageFile = null;
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 2000
    });
    toast.present();
  }

  onFileSelected(event: any) {
    this.imageFile = event.target.files[0];
  }

  navigateToTargetPage(segment: string, gato: InfoGato) {
    this.router.navigate([segment, gato.id], { state: { data: gato } });
  }
}
