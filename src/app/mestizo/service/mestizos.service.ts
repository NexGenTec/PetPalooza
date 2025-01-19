import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { Mestizos } from '../models/mestizo.models';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class MestizosService {

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private toastController: ToastController
  ) {
   }
}
