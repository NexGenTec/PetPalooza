import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }

  // Obtener cambios en una colección
  getCollectionChanges<T>(path: string): Observable<T[]> {
    return this.firestore.collection<T>(path).valueChanges();
  }

  addDocument<T>(collectionPath: string, data: T) {
    return this.firestore.collection(collectionPath).add(data);
  }

  // Obtener un documento específico de una colección
  getDocument<T>(path: string, documentId: string): Observable<T> {
    return this.firestore.collection<T>(path).doc(documentId).valueChanges();
  }

  // Actualizar un documento existente en una colección
  updateDocument<T>(path: string, documentId: string, data: Partial<T>) {
    return this.firestore.collection<T>(path).doc(documentId).update(data);
  }

  // Eliminar un documento de una colección
  deleteDocument<T>(path: string, documentId: string) {
    return this.firestore.collection<T>(path).doc(documentId).delete();
  }
}