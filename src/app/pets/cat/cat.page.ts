import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InfoGato } from '../../interface/InfoGato.models';
import { FirestoreService } from '../../service/firestore.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
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
        const imagePath = `Gatos/${gato.Raza}/imgPerfil/${imageFile.name}`;
        const uploadTask = this.storage.upload(imagePath, imageFile);
        const imageUrl = await (await uploadTask).ref.getDownloadURL();
        gato.imgPerfil = imageUrl;
      }

      if (imagesFiles.length > 0) {
        gato.Img = [];
        for (const image of imagesFiles) {
          const imagePath = `Gatos/${gato.Raza}/imagenes/${image.name}`;
          const uploadTask = this.storage.upload(imagePath, image);
          const imageUrl = await (await uploadTask).ref.getDownloadURL();
          gato.Img.push(imageUrl);
        }
      }

      await this.firestoreService.addDocument('InfoGatos', gato);
      this.loadData();
      await this.showToast('Gato agregado con éxito');
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
      await this.showToast('Gato actualizado con éxito');
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
            await this.firestoreService.deleteDocument('InfoGatos', gato.id);
            this.loadData();
            await this.showToast('Gato eliminado con éxito');
          },
        },
      ],
      mode:'ios'
    });

    await alert.present();
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
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
