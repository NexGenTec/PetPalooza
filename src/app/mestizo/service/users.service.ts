import { Injectable } from '@angular/core';
import { User } from 'firebase/auth';
import { Users } from '../models/users.models';
import { finalize } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private toastController: ToastController
  ) {
   }


   async uploadImage(file: File, filePath: string): Promise<string> {
    // Subir la imagen a Firebase Storage
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    return new Promise((resolve, reject) => {
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(
            (downloadURL) => {
              resolve(downloadURL);
            },
            (error) => reject(error)
          );
        })
      ).subscribe();
    });
  }

  async addUser(user: Users, file: File): Promise<void> {
    const imagePath = `user/${user.nombre}/${new Date().getTime()}_${file.name}`;
    try {
      // Subir la imagen y obtener la URL
      const imageUrl = await this.uploadImage(file, imagePath);

      // Añadir los datos del formulario a Firestore
      const userData: Users = {
        ...user,
        imagen: imageUrl, // Asignar la URL de la imagen
        createdAt: new Date(), // Fecha de creación
      };

      // Guardar el documento en la colección 'users'
      await this.firestore.collection('users').add(userData);

      // Mostrar un mensaje de éxito
      this.showToast('Formulario enviado con éxito.');
    } catch (error) {
      console.error('Error al subir los datos:', error);
      this.showToast('Hubo un error al subir la información.');
    }
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
    });
    await toast.present();
  }
}
