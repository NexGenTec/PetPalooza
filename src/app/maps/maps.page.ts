import { Component, ElementRef, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { AlertController, ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment.prod';
import { Veterinarias } from '../interface/Veterinarias.model';
import { FirestoreService } from '../service/firestore.service';
import { Clipboard } from '@capacitor/clipboard';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements AfterViewInit, OnInit {
  lat = -33.4489;
  lng = -70.6693;
  isShowingDetails: boolean = false;
  selectedPlace: Veterinarias | null = null;
  isModalOpen: boolean = false;

  @ViewChild('mapContainer', { static: false }) mapRef: ElementRef<HTMLElement>;
  newMap: GoogleMap;
  originalVeterinarias: Veterinarias[] = [];
  placeMarkers: Veterinarias[] = [];
  isLoading = true;
  placeGroupedByCategoria: { [key: string]: Veterinarias[] } = {};
  skeletonMap = Array(2);

  constructor(
    private modalController: ModalController,
    private firestores: FirestoreService,
    private alertController: AlertController 
  ) { }

  ngOnInit() { }

  async ngAfterViewInit() {
    if (Capacitor.getPlatform() !== 'web') {
      const hasPermission = await Geolocation.checkPermissions();
      if (hasPermission.location !== 'granted') {
        const requestResult = await Geolocation.requestPermissions();
        if (requestResult.location !== 'granted') {
          const alert = await this.alertController.create({
            header: 'Permiso de Localización Denegado',
            message: 'Para usar el mapa, necesitas permitir el acceso a tu ubicación.',
            buttons: ['OK']
          });
          await alert.present();
          return;
        }
      }
    }
    await this.createMap();
    this.setMarkerClickListener();
  }   

  async doRefresh(event: any) {
    console.log('Recargando datos...');
    await this.loadData();
    event.target.complete();
  }

  // Llamar a la colección de veterinarias en Firestore
  async loadData() {
    this.isLoading = true;
    try {
        this.firestores.getCollectionChanges<Veterinarias>('Maps').subscribe(async veterinarias => {
            if (veterinarias) {
                this.originalVeterinarias = veterinarias;
                this.placeGroupedByCategoria = this.groupPlacesByCategoria(this.originalVeterinarias);
                if (this.newMap) {
                    await this.addVeterinarias(veterinarias);
                } else {
                    console.warn('El mapa no está listo para añadir veterinarias.');
                }
                this.isLoading = false;
            }
        });
    } catch (error) {
        this.isLoading = false;
        const alert = await this.alertController.create({
            mode:'ios',
            header: 'Error',
            message: 'No se pudo cargar los datos de veterinarias. Intenta nuevamente más tarde.',
            buttons: ['OK']
        });
        await alert.present();
        console.error('Error cargando datos de Firestore', error);
    }
  }

  async createMap() {
    try {
      this.newMap = await GoogleMap.create({
        id: 'my-cool-map',
        element: this.mapRef.nativeElement,
        apiKey: environment.apiKey,
        config: this.getMapConfig(),
        forceCreate:true
      });
      await this.loadData(); 
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        mode:'ios',
        message: 'No se pudo cargar el mapa. Intenta nuevamente más tarde.',
        buttons: ['OK']
      });
      await alert.present();
      console.error('Error creando el mapa', error);
    }
  }

  private getMapConfig() {
    return {
      center: {
        lat: this.lat,
        lng: this.lng,
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
    };
  }

  async addVeterinarias(veterinarias: Veterinarias[]) {
    if (!this.newMap) {
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
            this.placeMarkers[vetsId] = vet;
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
  }

  setMarkerClickListener() {
    this.newMap.setOnMarkerClickListener(async (data) => {
      const vet = this.placeMarkers[data.markerId];
      if (vet) {
        const alert = await this.alertController.create({
          mode: 'ios',
          header: vet.Nombre,
          message: `Dirección: ${vet.Direccion}`,
          buttons: [
            {
              text: 'Ir al lugar',
              handler: () => {
                this.goToVeterinariaDetails(vet);
              }
            },
            {
              text: 'Copiar',
              handler: async () => {
                await Clipboard.write({
                  string: `Nombre: ${vet.Nombre}\nDirección: ${vet.Direccion}`
                });
              }
            },
          ]
        });
        await alert.present();
      }
    });
  }

  goToVeterinariaDetails(veterinaria: Veterinarias) {
    this.selectedPlace = veterinaria;
    this.isModalOpen = true;
    this.isShowingDetails = true;
  }

  goBackToList() {
    this.isShowingDetails = false;
    this.selectedPlace = null;
  }

  openModal() {
    this.isModalOpen = true;
  }

  dismiss() {
    this.modalController.dismiss();
    this.isModalOpen = false;
    this.goBackToList();
  }
  
  groupPlacesByCategoria(veterinarias: Veterinarias[]): { [key: string]: Veterinarias[] } {
    return veterinarias.reduce((grouped, veterinaria) => {
      const categoria = veterinaria.Categoria;
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
