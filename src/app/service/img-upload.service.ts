import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImgUploadService {

  constructor(private storage: AngularFireStorage, private firestore: AngularFirestore) { }
  
  updateGatoImage(gatoId: string, imageUrl: string) {
    console.log('Updating Firestore with image URL:', imageUrl);
    return this.firestore.collection('Gatos').doc(gatoId).update({ imgPerfil: imageUrl });
  }

  uploadImage(file: File, gatoRaza: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const filePath = `Gato/${gatoRaza}/ImgPendientes/${file.name}`;
      console.log('File path:', filePath);
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      // Monitor the upload task
      task.snapshotChanges().pipe(
        finalize(() => {
          console.log('Upload complete, getting download URL...');
          fileRef.getDownloadURL().subscribe(
            (url) => {
              console.log('Download URL:', url);
              resolve(url);
            },
            (error) => {
              console.error('Error getting download URL:', error);
              reject(error);
            }
          );
        })
      ).subscribe(
        (snapshot) => {
          console.log('Upload progress:', snapshot.bytesTransferred, 'of', snapshot.totalBytes);
        },
        (error) => {
          console.error('Error during upload:', error);
          reject(error);
        }
      );
    });
  }
}
