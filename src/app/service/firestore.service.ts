import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

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

  // Añadir un documento a una colección
  addDocument<T>(collectionName: string, data: T): Promise<DocumentReference<T>> {
    const collectionRef = this.firestore.collection<T>(collectionName);
    return collectionRef.add(data);
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
  deleteDocument(path: string, id: string | number) {
    return this.firestore.collection(path).doc(id.toString()).delete();
  }
}
