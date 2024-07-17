import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InfoGato } from '../../interface/InfoGato.models';
import { FirestoreService } from '../../service/firestore.service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { AlertController, ModalController, ToastController, LoadingController } from '@ionic/angular';
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
  newGato: InfoGato = this.initializeNewGato();
  imageFile: File | null = null;
  loading: HTMLIonLoadingElement; // Variable para mantener la referencia del loading

  constructor(
    private router: Router,
    private firestoreService: FirestoreService,
    private storage: AngularFireStorage,
    private modalController: ModalController,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController // Inyecta LoadingController
  ) {}

  ngOnInit() {
    this.loadData();
  }

  initializeNewGato(): InfoGato {
    return {
      Cuidados: [{ tipo: '', descripcion: '' }],
      Origen: '',
      Anio: '',
      Raza: '',
      Temperamento: [{ tipo: '', descripcion: '' }],
      Longevidad: '',
      Historia: '',
      imgPerfil: '',
      fechaCreacion: { seconds: 0, nanoseconds: 0 },
      Img: [],
      caracteristicasFisicas: [{ tipo: '', descripcion: '' }],
    };
  }

  loadData() {
    this.firestoreService.getCollectionChanges<InfoGato>('InfoGatos').subscribe((filteredGatos) => {
      this.gatos = filteredGatos;
      console.log('Gatos cargados:', this.gatos);
    });
  }

  async openModal(edit: boolean, gato?: InfoGato) {
    if (edit && gato) {
      this.newGato = { ...gato };
      // Mantén el ID del gato para poder pasarlo al guardar
      this.newGato.id = gato.id;
      if (gato.imgPerfil) {
        this.imageFile = null; 
      }
    } else {
      this.newGato = this.initializeNewGato();
      this.imageFile = null;
    }
  
    const modal = await this.modalController.create({
      component: CatModalPage,
      componentProps: { newGato: this.newGato, isEdit: edit },
    });
  
    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.gato) {
        // Verifica si la imagen se recibió correctamente desde el modal
        if (result.data.imageFile) {
          this.imageFile = result.data.imageFile;
          console.log('Archivo de imagen recibido:', this.imageFile);
        }

        if (edit) {
          console.log('Gato editado:', result.data.gato);
          this.saveGato(result.data.gato, true);
        } else {
          console.log('Nuevo gato agregado:', result.data.gato);
          this.saveGato(result.data.gato, false);
        }
      }
    });
  
    return await modal.present();
  }

  async saveGato(gato: InfoGato, edit: boolean) {
    // Mostrar loading antes de empezar la operación
    this.loading = await this.loadingController.create({
      message: edit ? 'Actualizando gato...' : 'Guardando gato...',
    });
    await this.loading.present();

    if (this.imageFile) {
      const filePath = `Gato/${gato.Raza}/${this.imageFile.name}`;
      const fileRef = this.storage.ref(filePath);
      const task: AngularFireUploadTask = this.storage.upload(filePath, this.imageFile);
  
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            // Actualiza el objeto gato con el nuevo URL de imagen
            gato.imgPerfil = url;
  
            // Si es una edición y hay una imagen anterior, borrarla
            if (edit && gato.id && gato.imgPerfil !== this.newGato.imgPerfil) {
              const oldImageRef = this.storage.refFromURL(gato.imgPerfil);
              oldImageRef.delete().toPromise().then(() => {
                console.log(`Imagen anterior ${gato.imgPerfil} eliminada`);
                // Guarda el gato en Firestore después de eliminar la imagen anterior
                this.saveGatoToFirestore(gato, edit);
              }).catch((error) => {
                console.error(`Error al eliminar imagen anterior ${gato.imgPerfil}`, error);
                // Aun así, guarda el gato en Firestore en caso de error al eliminar la imagen
                this.saveGatoToFirestore(gato, edit);
              });
            } else {
              // Si no hay imagen anterior para eliminar, guarda el gato en Firestore directamente
              this.saveGatoToFirestore(gato, edit);
            }
          });
        })
      ).subscribe();
    } else {
      // Si no hay nueva imagen, solo guarda el gato en Firestore
      this.saveGatoToFirestore(gato, edit);
    }
  }

  saveGatoToFirestore(gato: InfoGato, edit: boolean) {
    if (edit) {
      this.firestoreService.updateDocument<InfoGato>('InfoGatos', gato.id, gato).then(() => {
        this.afterSaveSuccess('Gato actualizado con éxito');
      }).catch((error) => {
        this.afterSaveError('Error al actualizar el gato', error);
      });
    } else {
      // Aquí llamamos a addDocument sin pasar un ID específico
      this.firestoreService.addDocument<InfoGato>('InfoGatos', gato).then(() => {
        this.afterSaveSuccess('Gato agregado con éxito');
      }).catch((error) => {
        this.afterSaveError('Error al agregar el gato', error);
      });
    }
  }

  afterSaveSuccess(message: string) {
    // Ocultar loading después de completar con éxito
    if (this.loading) {
      this.loading.dismiss();
    }
    this.resetNewGatoForm();
    this.loadData();
    this.presentToast(message, 'success');
  }

  afterSaveError(message: string, error: any) {
    // Ocultar loading en caso de error
    if (this.loading) {
      this.loading.dismiss();
    }
    console.error(message, error);
    this.presentToast(message, 'danger');
  }

  async deleteGato(gato: InfoGato) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      mode: 'ios',
      message: `¿Estás seguro de eliminar al gato ${gato.Raza}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              // Elimina el documento del gato en Firestore
              await this.firestoreService.deleteDocument('InfoGatos', gato.id);
          
              // Elimina la carpeta y su contenido en Firebase Storage
              const storageRef = this.storage.ref(`Gato/${gato.Raza}`);
              const res = await storageRef.listAll().toPromise();
          
              await Promise.all(res.items.map(async (item) => {
                await item.delete();
                console.log(`Archivo ${item.name} eliminado`);
              }));
          
              await storageRef.delete();
              
              // Actualiza la lista de gatos después de eliminar
              this.loadData();
              this.presentToast('Gato eliminado con éxito', 'success');
            } catch (error) {
              console.error('Error al eliminar el gato:', error);
              this.presentToast('Error al eliminar el gato', 'danger');
            }
          }
        }
      ]
    });

    await alert.present();
  }
  
  resetNewGatoForm() {
    this.newGato = this.initializeNewGato();
    this.imageFile = null;
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    toast.present();
  }
  
  navigateToTargetPage(segment: string, gato: InfoGato) {
    this.router.navigate([segment, gato.id], { state: { data: gato } });
  }
}
