import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ImgUser, InfoGato } from 'src/app/interface/InfoGato.models';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {

  constructor(private firestore: AngularFirestore) {
  }

  async updateImgUserInGato(gatoId: string, imgUserId: string, updates: Partial<ImgUser>) {  
    const gatoRef = this.firestore.collection('InfoGatos').doc(gatoId);
    const gatoDoc = await gatoRef.get().toPromise();
  
    if (gatoDoc.exists) {
      const gatoData = gatoDoc.data() as InfoGato;
      console.log('Datos del Gato:', gatoData);
  
      const imgUser = gatoData.ImgUsers.find(img => img.url === imgUserId);
      console.log('ImgUser encontrado:', imgUser);
  
      if (imgUser) {
        // Inicializa likedDevices y reactedDevices si son undefined
        imgUser.likedDevices = imgUser.likedDevices || [];
        imgUser.reactedDevices = imgUser.reactedDevices || [];
  
        // Aplica las actualizaciones
        const updatedImgUser = {
          ...imgUser,
          ...updates
        };
  
        console.log('ImgUser actualizado:', updatedImgUser);
  
        // Actualiza el documento en Firestore
        return gatoRef.update({
          ImgUsers: gatoData.ImgUsers.map(img => img.url === imgUserId ? updatedImgUser : img)
        });
      } else {
        console.error('ImgUser no encontrado');
        return Promise.reject('ImgUser no encontrado');
      }
    } else {
      console.error('Documento no encontrado');
      return Promise.reject('Documento no encontrado');
    }
  }
}
