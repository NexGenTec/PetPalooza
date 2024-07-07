import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications';
import { Notificaccion } from '../interface/Notification.models';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    private afs: AngularFirestore,
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
      console.log('Push registration success, token: ' + token.value);
      // Guardar el token en Firestore
      this.saveToken(token.value);
      // null indica que no hay notificación asociada
    });

    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      console.log('Push received: ' + JSON.stringify(notification));
      // Guardar la notificación en Firestore
      this.notificationToFirestore(notification);
      // Mostrar la notificación local
      this.showLocalNotification(notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      console.log('Push action performed: ' + JSON.stringify(notification));
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
      data: notification?.data || {},
      title: notification?.title || '', // Título de la notificación
      body: notification?.body || ''    // Cuerpo de la notificación
    };

    notificacionesCollection.add(data)
      .then(docRef => {
        console.log('Datos guardados en Firestore con ID: ', docRef.id);
      })
      .catch(error => {
        console.error('Error al guardar en Firestore: ', error);
      });
  }

  private showLocalNotification(notification: PushNotificationSchema) {
    const localNotification: LocalNotificationSchema = {
      title: notification.title,
      body: notification.body,
      id: typeof notification.id === 'string' ? parseInt(notification.id, 10) : notification.id || 1,
    };

    LocalNotifications.schedule({
      notifications: [localNotification]
    });
  }
}