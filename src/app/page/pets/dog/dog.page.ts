import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InfoPerro } from '../../../interface/InfoPerro.models';
import { FirestoreService } from '../../../service/firestore.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AlertController, ModalController, ToastController, LoadingController } from '@ionic/angular';
import { Clipboard } from '@capacitor/clipboard';
import { DogModalPage } from './dog-modal/dog-modal.page';

@Component({
  selector: 'app-dog',
  templateUrl: './dog.page.html',
  styleUrls: ['./dog.page.scss'],
})
export class DogPage implements OnInit {
  perros: InfoPerro[] = [];
  searchTerm: string = '';
  filteredPerros: InfoPerro[] = [];
  newPerro: InfoPerro = this.initializeNewPerro();
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

  initializeNewPerro(): InfoPerro {
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
    this.firestoreService.getCollectionChanges<InfoPerro>('InfoPerros').subscribe((filteredPerros) => {
      this.perros = filteredPerros;
      console.log('Perros cargados:', this.perros);
    });
  }

  async openModal(edit: boolean, perro?: InfoPerro) {
    if (edit && perro) {
      this.newPerro = { ...perro };
      this.newPerro.id = perro.id;
      if (perro.imgPerfil) {
        this.imageFile = null; 
      }
    } else {
      this.newPerro = this.initializeNewPerro();
      this.imageFile = null;
    }
  
    const modal = await this.modalController.create({
      component: DogModalPage,
      componentProps: { newPerro: this.newPerro, isEdit: edit },
    });
  
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        const { perro, imageFile, imagesFiles, action } = result.data;
        if (action === 'update') {
          this.updatePerro(perro, imageFile, imagesFiles);
        } else {
          this.addPerro(perro, imageFile, imagesFiles);
        }
      }
    });

    await modal.present();
  }

  async addPerro(perro: InfoPerro, imageFile: File | null, imagesFiles: File[]) {
    const loading = await this.loadingController.create({
      message: 'Agregando Perro...',
    });
    await loading.present();

    try {
      if (imageFile) {
        const imagePath = `Perro/${perro.Raza}/imgPerfil/${imageFile.name}`;
        const uploadTask = this.storage.upload(imagePath, imageFile);
        const imageUrl = await (await uploadTask).ref.getDownloadURL();
        perro.imgPerfil = imageUrl;
      }

      if (imagesFiles.length > 0) {
        perro.Img = [];
        for (const image of imagesFiles) {
          const imagePath = `Perro/${perro.Raza}/imagenes/${image.name}`;
          const uploadTask = this.storage.upload(imagePath, image);
          const imageUrl = await (await uploadTask).ref.getDownloadURL();
          perro.Img.push(imageUrl);
        }
      }

      const docRef = await this.firestoreService.addDocument('InfoPerros', perro);
      perro.id = docRef.id;
      console.log(docRef.id)
      console.log('Raza:', perro.Raza);
      console.log('Image URL:', perro.imgPerfil);
      this.loadData();
      await this.showToast('Perro agregado con éxito', 'success');
      await this.showNotificationAlert(perro);
    } catch (error) {
      await this.showToast('Hubo un error al agregar el perro: ' + error, 'danger');
    } finally {
      loading.dismiss();
    }
  }

  async updatePerro(perro: InfoPerro, imageFile: File | null, imagesFiles: File[]) {
    const loading = await this.loadingController.create({
      message: 'Actualizando Perro...',
    });
    await loading.present();

    try {
      if (imageFile) {
        const imagePath = `Perro/${perro.Raza}/imgPerfil/${imageFile.name}`;
        const uploadTask = this.storage.upload(imagePath, imageFile);
        const imageUrl = await (await uploadTask).ref.getDownloadURL();
        perro.imgPerfil = imageUrl;
      }

      if (imagesFiles.length > 0) {
        perro.Img = [];
        for (const image of imagesFiles) {
          const imagePath = `Perro/${perro.Raza}/imagenes/${image.name}`;
          const uploadTask = this.storage.upload(imagePath, image);
          const imageUrl = await (await uploadTask).ref.getDownloadURL();
          perro.Img.push(imageUrl);
        }
      }

      await this.firestoreService.updateDocument('InfoPerros', perro.id, perro);
      this.loadData();
      await this.showToast('Perro actualizado con éxito', 'success');
    } catch (error) {
      await this.showToast('Hubo un error al actualizar el perro: ' + error, 'danger');
    } finally {
      loading.dismiss();
    }
  }

  async deletePerro(perro: InfoPerro) {
    const loading = await this.loadingController.create({
      message: 'Eliminando Perro...',
    });
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este perro?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              await loading.present();
              await this.firestoreService.deleteDocument('InfoPerros', perro.id);
              this.loadData();
              await this.showToast('Perro eliminado con éxito', 'success');
            } catch (error) {
              await this.showToast('Hubo un error al eliminar el perro: ' + error, 'danger');
            } finally {
              loading.dismiss();
            }
          },
        },
      ],
      mode: 'ios',
    });
  
    await alert.present();
  }
  

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
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
      mode:'ios'
    });
    await alert.present();
  }

  resetNewPerroForm() {
    this.newPerro = this.initializeNewPerro();
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

  navigateToTargetPage(segment: string, perro: InfoPerro) {
    this.router.navigate([segment, perro.id], { state: { data: perro } });
  }

  async showNotificationAlert(perro: InfoPerro) {
    const alert = await this.alertController.create({
      header: 'Datos para notificación',
      subHeader: `ID de la Raza: ${perro.id}`,
      message: `Nombre de la Raza: ${perro.Raza}\n
                Ruta de la imagen del perfil: ${perro.imgPerfil}`,
      buttons: [
        {
          text: 'Copiar todos los datos',
          handler: () => {
            const dataToCopy = `
              ID de la Raza: ${perro.id}\n
              Nombre de la Raza: ${perro.Raza}\n
              Ruta de la imagen del perfil: ${perro.imgPerfil}\n
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
