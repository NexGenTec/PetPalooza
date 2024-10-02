import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ImgUser, InfoPerro } from 'src/app/interface/InfoPerro.models';
import { ImgUploadService } from 'src/app/service/img-upload.service';

@Component({
  selector: 'app-add-image',
  templateUrl: './add-image.page.html',
  styleUrls: ['./add-image.page.scss'],
})
export class AddImagePage implements OnInit {

  selectedFile: File | null = null;
  imageUrl: string | ArrayBuffer | null = null;
  imageName: string = '';
  @Input() perroRaza: string | null = null;
  @Input() perroId: string | null = null;

  constructor(
    private modalController: ModalController,
    private uploadService: ImgUploadService,
    private loading: LoadingController,
    private toastController: ToastController,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
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
    if (this.selectedFile && this.perroRaza && this.perroId) {
      try {
        const loading = await this.showLoading();
        const imageUrl = await this.uploadService.uploadImagePerro(this.selectedFile, this.perroRaza);
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
    if (this.perroId) {
      const docRef = this.firestore.collection('InfoPerros').doc(this.perroId);
      const doc = await docRef.get().toPromise();
      const currentData = doc.data() as InfoPerro;
      
        // Si el array de imágenes no existe, lo inicializamos.
        const updatedImgArray = currentData.ImgUsers ? [...currentData.ImgUsers] : [];
  
        // Crear un nuevo objeto ImgUser con un nombre y la URL de la imagen
        const newImgUser: ImgUser = {
          nombre: this.imageName,
          url: imageUrl
        };
    
        updatedImgArray.push(newImgUser);
    
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
