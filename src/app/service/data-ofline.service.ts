import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InfoGato } from '../interface/InfoGato.models';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataOflineService {

  constructor(private firestore: AngularFirestore) { }

  getGatoById(id: string): Observable<InfoGato> {
    return this.firestore.collection('InfoGatos').doc<InfoGato>(id).valueChanges();
  }
}
