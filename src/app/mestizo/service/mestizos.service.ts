import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, combineLatest, finalize, map, switchMap,} from 'rxjs';
import { Mestizos, Users } from '../models/users.models';

@Injectable({
  providedIn: 'root'
})
export class MestizosService {

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
  ) {}

  async uploadImages(files: string[], mestizo: Mestizos): Promise<string[]> {
    const imageUploadPromises = files.map((image: string) => this.uploadImageToFirebase(image, mestizo));
    return Promise.all(imageUploadPromises);
  }



  private uploadImageToFirebase(image: string, mestizo: Mestizos): Promise<string> {
    // Usamos el nombre del mestizo para definir la ruta
    const filePath = `Mestizo/${mestizo.nombre}/${new Date().getTime()}_${Math.random().toString(36).substring(2, 15)}`;
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

  async addMestizos(userId: string, mestizo: Mestizos, imageUrls: string[]): Promise<void> {
    try {
      const mestizoData: Mestizos = {
        ...mestizo,
        imagenMascota: imageUrls,
        createdAt: new Date(),
      };
  
      // Agregar el mestizo dentro de la subcolección 'mestizos' del usuario
      await this.firestore.collection(`users/${userId}/mestizos`).add(mestizoData);
      console.log('Mascota registrada con éxito');
    } catch (error) {
      console.error('Error al subir las imágenes o los datos:', error);
    }
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
  
        // Combinar todos los observables de mestizos en uno solo y aplanarlos en un solo array
        return combineLatest(mestizosObservables).pipe(
          map(mestizosArrays => 
            mestizosArrays.reduce((acc, curr) => acc.concat(curr), [])  // Aplanar el array de arrays usando reduce y concat
          )
        );
      })
    );
  }  
  

}