import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ImgUploadService } from 'src/app/service/img-upload.service';

@Component({
  selector: 'app-add-image',
  templateUrl: './add-image.page.html',
  styleUrls: ['./add-image.page.scss'],
})
export class AddImagePage implements OnInit {

  selectedFile: File | null = null;
  imageUrl: string | ArrayBuffer | null = null;
  @Input() perroRaza: string | null = null;

  constructor(
    private modalController: ModalController,
    private uploadService: ImgUploadService,
    private loading: LoadingController,
    private toastController: ToastController,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    console.log('Raza del perro en AddImagePage:', this.perroRaza);  
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async uploadImage() {
    if (this.selectedFile && this.perroRaza) {
      const loading = await this.showLoading();
      try {
        const imageUrl = await this.uploadService.uploadImagePerro(this.selectedFile, this.perroRaza);
        console.log('Imagen subida exitosamente: ', imageUrl);
        await this.firestore.collection('SolicitudesImg').add({
          perroRaza: this.perroRaza,
          imageUrl: imageUrl,
          timestamp: new Date()
        });
        console.log('Firestore actualizado exitosamente.');
        await this.presentToast('Imagen subida exitosamente. Su imagen será revisada.', 'success');
      } catch (error) {
        console.error('Error al subir la imagen: ', error);

        await this.presentToast('No se pudo subir la imagen. Inténtelo de nuevo.', 'danger');
      } finally {
        loading.dismiss();
        this.closeModal();
      }
    }
  }

  async showLoading() {
    const loading = await this.loading.create({
      message: 'Subiendo imagen...',
    });
    await loading.present();
    return loading;
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    await toast.present();
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
