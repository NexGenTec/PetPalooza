import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Veterinarias } from '../interface/Veterinarias.model';
import { FirestoreService } from '../service/firestore.service';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements AfterViewInit {

  @ViewChild('mapContainer', { static: false }) mapRef: ElementRef<HTMLElement>;
  newMap: GoogleMap;
  originalVeterinarias: Veterinarias[] = [];
  veterinariaMarkers: Veterinarias[] = [];

  constructor(
    private modalController: ModalController,
    private firestores: FirestoreService,
  ) { }

  async ngAfterViewInit() {
    await this.createMap();
    this.loadData();
  }

  /*/
  Se llaman la coleccion de veterinaris
  */
  async loadData() {
    this.firestores.getCollectionChanges<Veterinarias>('Maps').subscribe(veterinarias => {
      if (veterinarias) {
        this.originalVeterinarias = veterinarias;
        console.log(veterinarias)
        this.addVeterinarias(veterinarias);
      }
    });
  }

  async createMap() {
    try {
      this.newMap = await GoogleMap.create({
        id: 'my-cool-map',
        element: this.mapRef.nativeElement,
        apiKey: environment.apiKey,
        config: {
          center: {
            lat: -33.4489,
            lng: -70.6693,
          },
          zoom: 11,
          styles: [
            {
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#e0e0e0"
                }
              ]
            },
            {
              "elementType": "labels.icon",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#616161"
                }
              ]
            },
            {
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#f5f5f5"
                }
              ]
            },
            {
              "featureType": "administrative.land_parcel",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#bdbdbd"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#eeeeee"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#757575"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#e5e5e5"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#9e9e9e"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#ffffff"
                }
              ]
            },
            {
              "featureType": "road.arterial",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#757575"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#ffffff"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#616161"
                }
              ]
            },
            {
              "featureType": "transit",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#f5f5f5"
                }
              ]
            },
            {
              "featureType": "transit.station",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#757575"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#b4c6e0"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#ffffff"
                }
              ]
            }
          ],
        },
      });
      this.loadData();      

    } catch (error) {
      console.error('Error creating the map', error);
    }
  }

  private async addVeterinarias(veterinarias: Veterinarias[]) {
    for (const vet of veterinarias) {
      const vetsId = await this.newMap.addMarker({
        coordinate: {
          lat: parseFloat(vet.Localizacion.Latitud), 
          lng: parseFloat(vet.Localizacion.Longitud)
        },
        title: vet.Nombre,
        snippet: `Dirección: ${vet.Direccion}\nDescripción: ${vet.Descripcion}`,
      });
      this.veterinariaMarkers[vetsId] = vet;
    }
  }
  dismiss() {
    this.modalController.dismiss();
  }
}
