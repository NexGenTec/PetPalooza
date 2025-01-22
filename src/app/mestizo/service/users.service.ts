import { Injectable } from '@angular/core';
import { User } from 'firebase/auth';
import { Users } from '../models/users.models';
import { finalize } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
  ) {
   }


   async uploadImage(file: File, filePath: string): Promise<string> {
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

  async addUser(user: Users, file: File): Promise<Users> {
    const imagePath = `user/${user.nombre}/${new Date().getTime()}_${file.name}`;
    try {
      const imageUrl = await this.uploadImage(file, imagePath);
      const userData: Users = {
        ...user,
        imagen: imageUrl,
        createdAt: new Date(),
      };
      await this.firestore.collection('users').add(userData);
      return userData;
    } catch (error) {
      console.error('Error al subir los datos:', error);
      throw new Error('Error al subir los datos');
    }
  }
}
