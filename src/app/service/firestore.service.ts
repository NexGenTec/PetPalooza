import { Injectable } from '@angular/core';
import { collection, collectionData, doc, docData, DocumentReference, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {v4 as uuidv4} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: Firestore) { }

  getDocument<tipo>(enlace: string) {
    const document = doc(this.firestore, enlace) as DocumentReference<tipo>;
    return getDoc(document);
  }

  getDocumentChanges<tipo>(enlace: string) {
    const document = doc(this.firestore, enlace);
    return docData(document) as Observable<tipo>;
  }

  getCollectionChanges<tipo>(path: string): Observable<tipo[]> {
    const itemCollection = collection(this.firestore, path);
    return collectionData(itemCollection, { idField: 'id' }) as Observable<tipo[]>;
  }

  createDocument(data: any, enlace: string) {
    const document = doc(this.firestore, enlace);
    return setDoc(document, data);
  }

  createDocumentID(data: any, enlace: string, idDoc: string) {
    const document = doc(this.firestore, `${enlace}/${idDoc}`);
    return setDoc(document, data);
  }

  createIdDoc() {
    return uuidv4()
  }
}
