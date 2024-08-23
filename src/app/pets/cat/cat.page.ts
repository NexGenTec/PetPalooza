import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InfoGato } from '../../interface/InfoGato.models';
import { FirestoreService } from '../../service/firestore.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AlertController, ModalController, ToastController, LoadingController } from '@ionic/angular';
import { CatModalPage } from './cat-modal/cat-modal.page';
import { Clipboard } from '@capacitor/clipboard';

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
  imagesFiles: File[] = [];
  loading: HTMLIonLoadingElement;

  constructor(
    private router: Router,
    private firestoreService: FirestoreService,
    private storage: AngularFireStorage,
    private modalController: ModalController,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController
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
      if (result.data) {
        const { gato, imageFile, imagesFiles, action } = result.data;
        if (action === 'update') {
          this.updateGato(gato, imageFile, imagesFiles);
        } else {
          this.addGato(gato, imageFile, imagesFiles);
        }
      }
    });

    await modal.present();
  }

  async addGato(gato: InfoGato, imageFile: File | null, imagesFiles: File[]) {
    const loading = await this.loadingController.create({
      message: 'Agregando Gato...',
    });
    await loading.present();

    try {
      if (imageFile) {
        const imagePath = `Gato/${gato.Raza}/imgPerfil/${imageFile.name}`;
        const uploadTask = this.storage.upload(imagePath, imageFile);
        const imageUrl = await (await uploadTask).ref.getDownloadURL();
        gato.imgPerfil = imageUrl;
      }

      if (imagesFiles.length > 0) {
        gato.Img = [];
        for (const image of imagesFiles) {
          const imagePath = `Gato/${gato.Raza}/imagenes/${image.name}`;
          const uploadTask = this.storage.upload(imagePath, image);
          const imageUrl = await (await uploadTask).ref.getDownloadURL();
          gato.Img.push(imageUrl);
        }
      }

      const docRef = await this.firestoreService.addDocument('InfoGatos', gato);
      gato.id = docRef.id;
      console.log(docRef.id)
      console.log('Raza:', gato.Raza);
      console.log('Image URL:', gato.imgPerfil);
      this.loadData();
      await this.showNotificationAlert(gato);
      await this.showToast('Gato agregado con éxito', 'success');
    } catch (error) {
      await this.showAlert('Error', 'Hubo un error al agregar el gato: ' + error);
    } finally {
      loading.dismiss();
    }
  }

  async updateGato(gato: InfoGato, imageFile: File | null, imagesFiles: File[]) {
    const loading = await this.loadingController.create({
      message: 'Actualizando Gato...',
    });
    await loading.present();

    try {
      if (imageFile) {
        const imagePath = `Gato/${gato.Raza}/imgPerfil/${imageFile.name}`;
        const uploadTask = this.storage.upload(imagePath, imageFile);
        const imageUrl = await (await uploadTask).ref.getDownloadURL();
        gato.imgPerfil = imageUrl;
      }

      if (imagesFiles.length > 0) {
        gato.Img = [];
        for (const image of imagesFiles) {
          const imagePath = `Gato/${gato.Raza}/imagenes/${image.name}`;
          const uploadTask = this.storage.upload(imagePath, image);
          const imageUrl = await (await uploadTask).ref.getDownloadURL();
          gato.Img.push(imageUrl);
        }
      }

      await this.firestoreService.updateDocument('InfoGatos', gato.id, gato);
      this.loadData();
      await this.showToast('Gato actualizado con éxito', 'success');
    } catch (error) {
      await this.showAlert('Error', 'Hubo un error al actualizar el gato: ' + error);
    } finally {
      loading.dismiss();
    }
  }

  async deleteGato(gato: InfoGato) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este gato?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Eliminando Gato...',
            });
            await loading.present();
            try {
              await this.firestoreService.deleteDocument('InfoGatos', gato.id);
              this.loadData();
              await this.showToast('Gato eliminado con éxito', 'success');
            } catch (error) {
              await this.showToast('Error al eliminar el gato', 'danger');
            } finally {
              loading.dismiss();
            }
          },
        },
      ],
      mode: 'ios'
    });

    await alert.present();
  }

  async showToast(message: string, type: 'success' | 'danger') {
    const color = type === 'success' ? 'success' : 'danger';
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    toast.present();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
      mode: 'ios'
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

  async showNotificationAlert(gato: InfoGato) {
    const alert = await this.alertController.create({
      header: 'Datos para notificación',
      subHeader: `ID de la Raza: ${gato.id}`,
      message: `Nombre de la Raza: ${gato.Raza}\n
                Ruta de la imagen del perfil: ${gato.imgPerfil}`,
      buttons: [
        {
          text: 'Copiar todos los datos',
          handler: () => {
            const dataToCopy = `
              ID de la Raza: ${gato.id}\n
              Nombre de la Raza: ${gato.Raza}\n
              Ruta de la imagen del perfil: ${gato.imgPerfil}\n
            `;
            Clipboard.write({
              string: dataToCopy
            });
            this.showToast('Datos copiados al portapapeles', 'success');
          }
        },
        {
          text: 'OK',
          role: 'cancel'
        }
      ],
      mode: 'ios'
    });
  
    await alert.present();
  }

  copyToClipboard(elementId: string) {
    const element = document.getElementById(elementId);
    if (element) {
      const textToCopy = element.innerText;
      Clipboard.write({
        string: textToCopy
      }).then(() => {
        this.showToast('Dato copiado al portapapeles', 'success');
      }).catch((error) => {
        this.showToast('Error al copiar al portapapeles: ' + error, 'danger');
      });
    }
  }
}
