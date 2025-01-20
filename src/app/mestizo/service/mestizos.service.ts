import { Injectable } from '@angular/core';
import { Mestizos } from '../models/mestizo.models';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class MestizosService {

  private readonly collectionName = ' Mestizo';

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  addMestizos(data: Mestizos) {
    return this.firestore.collection(this.collectionName).add(data);
  }
}
