import { Component, ElementRef, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { AlertController, ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Veterinarias } from '../interface/Veterinarias.model';
import { FirestoreService } from '../service/firestore.service';
import { Clipboard } from '@capacitor/clipboard'; // Importar el plugin Clipboard de Capacitor

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements AfterViewInit, OnInit {

  @ViewChild('mapContainer', { static: false }) mapRef: ElementRef<HTMLElement>;
  newMap: GoogleMap;
  originalVeterinarias: Veterinarias[] = [];
  veterinariaMarkers: Veterinarias[] = [];
  isLoading = true;
  veterinariasGroupedByCategoria: { [key: string]: Veterinarias[] } = {};
  skeletonMap = Array(2); 

  constructor(
    private modalController: ModalController,
    private firestores: FirestoreService,
    private alertController: AlertController 
  ) { }

  ngOnInit() {
  }

  async ngAfterViewInit() {
    await this.createMap();
    this.setMarkerClickListener();
  }

  /*/
  Se llaman la coleccion de veterinaris
  */
  async loadData() {
    await this.firestores.getCollectionChanges<Veterinarias>('Maps').subscribe(veterinarias => {
      if (veterinarias) {
        this.originalVeterinarias = veterinarias;
        this.veterinariasGroupedByCategoria = this.groupVeterinariasByCategoria(this.originalVeterinarias);
        if (this.newMap) {
          this.addVeterinarias(veterinarias);
        } else {
          console.warn('El mapa no está listo para añadir veterinarias.');
        }
  
        console.log('Veterinarias agrupadas por categoría:', this.veterinariasGroupedByCategoria);
        this.isLoading = false;
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

  async addVeterinarias(veterinarias: Veterinarias[]) {
    if (!this.newMap) {
      console.warn('El mapa no está listo para añadir veterinarias.');
      return;
    }
    for (const vet of veterinarias) {
      if (vet.Latitud && vet.Longitud) {
        const lat = parseFloat(vet.Latitud);
        const lng = parseFloat(vet.Longitud);
  
        if (!isNaN(lat) && !isNaN(lng)) {
          try {
            const vetsId = await this.newMap.addMarker({
              coordinate: { lat, lng },
              title: vet.Nombre,
              snippet: `Dirección: ${vet.Direccion}\nDescripción: ${vet.Descripcion}`,
            });
            this.veterinariaMarkers[vetsId] = vet;
            console.log(`Añadiendo marcador para ${vet.Nombre} en (${lat}, ${lng})`);
          } catch (error) {
            console.error(`Error al añadir marcador para ${vet.Nombre}:`, error);
          }
        } else {
          console.warn(`Coordenadas no válidas para la veterinaria: ${vet.Nombre}`, vet);
        }
      } else {
        console.warn(`Localización no definida para la veterinaria: ${vet.Nombre}`, vet);
      }
    }
  
    console.log('Marcadores actuales:', this.veterinariaMarkers); 
  }

  setMarkerClickListener() {
    this.newMap.setOnMarkerClickListener(async (data) => {
      const vet = this.veterinariaMarkers[data.markerId];
      if (vet) {
        const alert = await this.alertController.create({
          mode: 'ios',
          header: vet.Nombre,
          message: `Dirección: ${vet.Direccion}`,
          buttons: [
            {
              text: 'OK',
              role: 'cancel',
              handler: () => {
                console.log('El usuario ha cerrado el alerta');
              }
            },
            {
              text: 'Copiar',
              handler: async () => {
                await Clipboard.write({
                  string: `Nombre: ${vet.Nombre}\nDirección: ${vet.Direccion}`
                });
                console.log('Datos copiados al portapapeles');
              }
            }
          ]
        });
        await alert.present();
      }
    });
  }
    

  dismiss() {
    this.modalController.dismiss();
  }

  groupVeterinariasByCategoria(veterinarias: Veterinarias[]): { [key: string]: Veterinarias[] } {
    return veterinarias.reduce((grouped, veterinaria) => {
      const categoria = veterinaria.Categoria;
      console.log('Categoría:', categoria);
      if (!grouped[categoria]) {
        grouped[categoria] = [];
      }
      grouped[categoria].push(veterinaria);
      return grouped;
    }, {});
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
