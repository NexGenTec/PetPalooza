import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, combineLatest, finalize, map, of, switchMap,} from 'rxjs';
import { Mestizos, Users } from '../models/users.models';
import { v4 as uuidv4 } from 'uuid';
import { user } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class MestizosService {
  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
  ) {}

  async uploadImages(files: string[], mestizo: Mestizos): Promise<string[]> {
    const imageUploadPromises = files.map((imageUrl: string) => {
      if (imageUrl.startsWith('data:image')) {
        return this.uploadImageToFirebase(imageUrl, mestizo);
      } else {
        return Promise.resolve(imageUrl);
      }
    });
  
    return Promise.all(imageUploadPromises);
  }
  
  private uploadImageToFirebase(image: string, mestizo: Mestizos): Promise<string> {
    const fileId = uuidv4();
    const userSession = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = userSession.id;
    const filePath = `Mestizo/${userId}/${fileId}_${new Date().getTime()}`; 
    const fileRef = this.storage.ref(filePath);
  
    return new Promise((resolve, reject) => {
      const uploadTask = fileRef.putString(image, 'data_url');
  
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe({
              next: (downloadURL) => resolve(downloadURL),
              error: (error) => reject(error)
          });
      })
      ).subscribe();
    });
  }
  
  async updateMestizoWithoutImages(mestizo: Mestizos): Promise<void> {
    try {
      const userSession = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = userSession.id;
  
      const { imagenMascota, ...updatedMestizoData } = mestizo;
      const docRef = this.firestore.collection(`users/${userId}/mestizos`).doc(mestizo.id);
      await docRef.update(updatedMestizoData);
    } catch (error) {
      console.error('Error al actualizar el mestizo:', error);
      throw new Error('No se pudo actualizar el mestizo');
    }
  }  
  
  async addMestizos(userId: string, mestizo: Mestizos, imageUrls: string[]): Promise<void> {
    try {
      const mestizoData: Mestizos = {
        ...mestizo,
        imagenMascota: imageUrls,
        createdAt: new Date(),
      };
      const docRef = await this.firestore.collection(`users/${userId}/mestizos`).add(mestizoData);
      await docRef.update({ id: docRef.id });
    } catch (error) {
      console.error('Error al subir las imágenes o los datos:', error);
    }
  }
  
  async updateMestizo(mestizo: Mestizos): Promise<void> {
    try {
      const userId = mestizo.id;
      const docRef = this.firestore.collection(`users/${userId}/mestizos`).doc(mestizo.id);
      await docRef.update(mestizo);
    } catch (error) {
      throw new Error('No se pudo actualizar el mestizo');
    }
  }


  async uploadImage(file: File, filePath: string): Promise<string> {
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    return new Promise((resolve, reject) => {
        task.snapshotChanges().pipe(
            finalize(() => {
                fileRef.getDownloadURL().subscribe({
                    next: (downloadURL) => resolve(downloadURL),
                    error: (error) => reject(error)
                });
            })
        ).subscribe();
    })
  }


  async addUser(user: Users, file: File): Promise<Users> {
    const userId = uuidv4();
    const imagePath = `user/${userId}/${new Date().getTime()}_${file.name}`;
    try {
      const imageUrl = await this.uploadImage(file, imagePath);
      const userData: Users = {
        ...user,
        imagen: imageUrl,
        createdAt: new Date(),
      };
      const userDocRef = await this.firestore.collection('users').add(userData);
      userData.id = userDocRef.id;
  
      return userData;
    } catch (error) {
      console.error('Error al subir los datos:', error);
      throw new Error('Error al subir los datos');
    }
  }  

  getMestizosByUserId(userId: string): Observable<Mestizos[]> {
    return this.firestore.collection<Mestizos>(`users/${userId}/mestizos`).valueChanges();
  }

  getAllUsersWithMestizos(): Observable<Mestizos[]> {
    return this.firestore.collection<Users>('users').snapshotChanges().pipe(
      switchMap(usersSnapshot => {
        const mestizosObservables = usersSnapshot.map(userDoc => {
          const userId = userDoc.payload.doc.id;
          return this.firestore.collection<Mestizos>(`users/${userId}/mestizos`).valueChanges();
        });
        return combineLatest(mestizosObservables).pipe(
          map(mestizosArrays => {
            const allMestizos = mestizosArrays.reduce((acc, curr) => acc.concat(curr), []);
            return allMestizos;
          })
        );
      })
    );
  }  

  getMestizoByIdAndUser(userId: string, mestizoId: string): Observable<Mestizos> {
    return this.firestore.collection(`users/${userId}/mestizos`)
      .doc<Mestizos>(mestizoId)
      .valueChanges();
  }

  getMestizoById(id: string) {
    return this.firestore.collection<Users>('users').snapshotChanges().pipe(
      switchMap(usersSnapshot => {
        const mestizoObservables = usersSnapshot.map(userDoc => {
          const userId = userDoc.payload.doc.id;
          return this.firestore.collection<Mestizos>(`users/${userId}/mestizos`).doc(id).valueChanges();
        });
        return combineLatest(mestizoObservables).pipe(
          map(mestizos => mestizos.find(mestizo => mestizo !== undefined))
        );
      })
    );
  }
}