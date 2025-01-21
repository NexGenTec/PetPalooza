import { Injectable } from '@angular/core';
import { Mestizos } from '../models/mestizo.models';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MestizosService {

  private readonly collectionName = 'Mestizo';

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
  ) {}

  async uploadImages(files: string[]): Promise<string[]> {
    const imageUploadPromises = files.map((image: string) => this.uploadImageToFirebase(image));
    return Promise.all(imageUploadPromises);
  }


  private uploadImageToFirebase(image: string): Promise<string> {
    const filePath = `Mestizo/${new Date().getTime()}_${Math.random().toString(36).substring(2, 15)}`;
    const fileRef = this.storage.ref(filePath);

    return new Promise((resolve, reject) => {
      const uploadTask = fileRef.putString(image, 'data_url');

      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(
            (downloadURL) => resolve(downloadURL),
            (error) => reject(error)
          );
        })
      ).subscribe();
    });
  }

  async addMestizos(mestizo: Mestizos, imageUrls: string[]): Promise<void> {
    try {
      const mestizoData: Mestizos = {
        ...mestizo,
        imagenMascota: imageUrls,
        createdAt: new Date(),
      };
      await this.firestore.collection(this.collectionName).add(mestizoData);
      console.log('Mascota registrada con éxito');
    } catch (error) {
      console.error('Error al subir las imágenes o los datos:', error);
    }
  }
}