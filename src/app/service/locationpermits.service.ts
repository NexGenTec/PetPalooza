import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LocationpermitsService {
  constructor(private alertController: AlertController) {}

  // Verifica si el permiso de geolocalización ya ha sido concedido
  async checkGeolocationPermission(): Promise<boolean> {
    const permissions = await Geolocation.checkPermissions();
    return permissions.location === 'granted';
  }

  // Solicita el permiso de geolocalización si no ha sido concedido
  async requestGeolocationPermission(): Promise<boolean> {
    const result = await Geolocation.requestPermissions();
    if (result.location !== 'granted') {
      await this.showPermissionDeniedAlert();
      return false;
    }
    return true;
  }

  // Obtiene la posición actual del usuario si los permisos han sido concedidos
  async getCurrentPosition(): Promise<{ lat: number, lng: number } | null> {
    const hasPermission = await this.checkGeolocationPermission();
    if (!hasPermission) {
      const permissionGranted = await this.requestGeolocationPermission();
      if (!permissionGranted) {
        return null;
      }
    }

    // Si los permisos han sido concedidos, obtenemos la ubicación
    const position = await Geolocation.getCurrentPosition();
    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
  }

  // Muestra una alerta si los permisos han sido denegados
  private async showPermissionDeniedAlert() {
    const alert = await this.alertController.create({
      mode: 'ios',
      header: 'Permiso de Localización Denegado',
      message: 'Se utilizarán coordenadas por defecto.',
      buttons: ['OK'],
    });
    await alert.present();
  }
}
