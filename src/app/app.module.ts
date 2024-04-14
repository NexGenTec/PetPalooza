import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import {
  faSquare as farSquare,
  faCheckSquare as farCheckSquare,
} from '@fortawesome/free-regular-svg-icons';
import {
  faStackOverflow,
  faGithub,
  faMedium,
} from '@fortawesome/free-brands-svg-icons';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

const routes: Routes = [

]


@NgModule({
  declarations: [AppComponent],
  imports: [HttpClientModule, BrowserModule, IonicModule.forRoot(), AppRoutingModule, FontAwesomeModule, FormsModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {
  faCoffee = faCoffee;
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faSquare,
      faCheckSquare,
      farSquare,
      farCheckSquare,
      faStackOverflow,
      faGithub,
      faMedium,
    );
  }
}
