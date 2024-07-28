import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InfoGato } from '../interface/InfoGato.models';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { InfoPerro } from '../interface/InfoPerro.models';

@Injectable({
  providedIn: 'root'
})
export class DataOflineService {

  constructor(private firestore: AngularFirestore) { }

  getGatoById(id: string): Observable<InfoGato> {
    return this.firestore.collection('InfoGatos').doc<InfoGato>(id).valueChanges();
  }

  getPerroById(id: string): Observable<InfoPerro> {
    return this.firestore.collection('InfoPerros').doc<InfoPerro>(id).valueChanges();
  }
}
