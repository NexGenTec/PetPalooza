import { Component, Optional } from '@angular/core';
import { AlertController, IonRouterOutlet, Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],

})
export class AppComponent {
  private lastTimeBackPress = 0;
  private timePeriodToExit = 2000;

  constructor(
    private platform: Platform,
    private alertCtrl: AlertController,
    private router: Router,
    @Optional() private routerOutlet?: IonRouterOutlet
  ) {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet?.canGoBack()) {
        if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
          this.alertExit();
        } else {
          this.lastTimeBackPress = new Date().getTime();
        }
      }
    });
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      console.log('Navegación a:', event.urlAfterRedirects);
      // Aquí puedes manejar la navegación basada en el URL
    });
  }

  async alertExit() {
    const alert = await this.alertCtrl.create({
      header: 'Salir de la aplicación',
      subHeader: 'Confirmar',
      message: '¿Estás seguro que quieres salir de la aplicación?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'alert-button-no',
        },
        {
          text: 'Si',
          role: 'confirm',
          cssClass: 'alert-button-yes',
          handler: () => { App.exitApp(); }
        }
      ],
      mode: 'ios'
    });
    await alert.present();
  }
}