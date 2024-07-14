import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }

  // Obtener cambios en una colección con IDs
  getCollectionChanges<T>(path: string): Observable<({ id: string } & T)[]> {
    return this.firestore.collection<T>(path).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as T;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
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