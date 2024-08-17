import { Component, OnInit, Input } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ImgUploadService } from '../../../service/img-upload.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { InfoGato } from '../../../interface/InfoGato.models';

@Component({
  selector: 'app-add-image',
  templateUrl: './add-image.page.html',
  styleUrls: ['./add-image.page.scss'],
})
export class AddImagePage implements OnInit {

  selectedFile: File | null = null;
  imageUrl: string | ArrayBuffer | null = null;
  @Input() gatoRaza: string | null = null;
  @Input() gatoId: string | null = null; 

  constructor(
    private modalController: ModalController,
    private uploadService: ImgUploadService,
    private loading: LoadingController,
    private toastController: ToastController,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    console.log('Raza del gato en AddImagePage:', this.gatoRaza);
    console.log('ID del gato en AddImagePage:', this.gatoId);
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
    if (this.selectedFile && this.gatoRaza && this.gatoId) {
      try {
        const loading = await this.showLoading();
        const imageUrl = await this.uploadService.uploadImageGato(this.selectedFile, this.gatoRaza);
        await this.updateFirestoreImage(imageUrl);
        await loading.dismiss();
        await this.presentToast('Imagen subida con éxito', 'success');
        this.closeModal(); 
      } catch (error) {
        await this.presentToast('Error al subir la imagen', 'danger');
      }
    } else {
      await this.presentToast('Seleccione un archivo y asegúrese de que la raza y ID estén definidos', 'warning');
    }
  }

  async updateFirestoreImage(imageUrl: string) {
    if (this.gatoId) {
      const docRef = this.firestore.collection('InfoGatos').doc(this.gatoId);
      const doc = await docRef.get().toPromise();
      const currentData = doc.data() as InfoGato;
      
      // Si el array de imágenes no existe, lo inicializamos.
      const updatedImgArray = currentData.ImgUsers ? [...currentData.ImgUsers] : [];

      updatedImgArray.push(imageUrl);

      return docRef.update({ ImgUsers: updatedImgArray });
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