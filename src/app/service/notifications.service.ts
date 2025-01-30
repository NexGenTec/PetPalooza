import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { Notificaccion } from '../interface/Notification.models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    private afs: AngularFirestore,
    private router: Router
  ) { }

  initPushNotifications() {
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      } else {
        console.log('Push registration not granted.');
      }
    });

    PushNotifications.addListener('registration', (token: Token) => {
      this.saveToken(token.value);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      this.notificationToFirestore(notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      const data = notification.notification.data;
      if (data.Route) {
        this.router.navigate([data.Route]);
      } else {
        console.error('No route found in notification data.');
      }
    });
  }

  private saveToken(token: string | null) {
    const tokens = this.afs.collection('Token');
    // Datos comunes a guardar
    const data: any = {
      Tokens: token,
    };

    tokens.add(data)
      .then(docRef => {
        console.log('Datos guardados en Firestore con ID: ', docRef.id);
      })
      .catch(error => {
        console.error('Error al guardar en Firestore: ', error);
      });
  }

  private notificationToFirestore(notification: PushNotificationSchema | null) {
    const notificacionesCollection = this.afs.collection('Notificaciones');
    // Datos comunes a guardar
    const data: Notificaccion = {
      id: notification?.id || '',
      title: notification?.title || '',
      body: notification?.body || ''
    };

    notificacionesCollection.add(data)
      .then(docRef => {
        console.log('Datos guardados en Firestore con ID: ', docRef.id);
      })
      .catch(error => {
        console.error('Error al guardar en Firestore: ', error);
      });
  }
}