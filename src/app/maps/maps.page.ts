import { Component, ElementRef, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { AlertController, IonModal, ModalController, Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Maps } from '../interface/Veterinarias.model';
import { FirestoreService } from '../service/firestore.service';
import { Clipboard } from '@capacitor/clipboard';
import { Capacitor } from '@capacitor/core';
import { LocationpermitsService } from '../service/locationpermits.service';
import { Timestamp } from "firebase/firestore";

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements AfterViewInit, OnInit {
  lat = -33.4489;
  lng = -70.6693;
  isShowingDetails: boolean = false;
  selectedPlace: Maps | null = null;
  isModalOpen: boolean = false;
  @ViewChild('modal', { static: false }) modal: IonModal;
  @ViewChild('mapContainer', { static: false }) mapRef: ElementRef<HTMLElement>;
  newMap: GoogleMap;
  originalVeterinarias: Maps[] = [];
  placeMarkers: Maps[] = [];
  isLoading = true;
  placeGroupedByCategoria: { [key: string]: Maps[] } = {};
  skeletonMap = Array(2);
  presentingElement = null;
  fabPosition: { vertical: string; horizontal: string };
  userPosition: { lat: number, lng: number } | null = null;

  constructor(
    private modalController: ModalController,
    private firestores: FirestoreService,
    private alertController: AlertController,
    private platform: Platform,
    private locationPermitsService: LocationpermitsService 
  ) { }

  ngOnInit() {
    this.setFabPosition();
    this.onFabClick();
    this.permisionLocation();
    this.checkPermissionAndLocation();
  }

  async ionViewWillEnter() {
    await this.createMap();
    if (this.newMap) {
        await this.newMap.setCamera({
            coordinate: {
                lat: this.mapState.lat,
                lng: this.mapState.lng
            },
            zoom: this.mapState.zoom,
            bearing: 0,
            angle: 0,
            animate: true
        });
    }
  }



  async ngAfterViewInit() {
    await this.createMap();
    this.setMarkerClickListener();
  }     

  async doRefresh(event: any) {
    console.log('Recargando datos...');
    await this.loadData(); 
    if (this.newMap) {
      await this.addVeterinarias(this.originalVeterinarias); 
      this.createMap();
    }
    event.target.complete();
  }
  
  refreshMap() {
    this.loadData();
    this.createMap();
  }

  /*/
  Se llaman la coleccion de veterinaris
  */
  async loadData() {
    this.isLoading = true;
    await this.firestores.getCollectionChanges<Maps>('Maps').subscribe(veterinarias => {
      if (veterinarias) {
        this.originalVeterinarias = veterinarias;
        this.placeGroupedByCategoria = this.groupPlacesByCategoria(this.originalVeterinarias);
        if (this.newMap) {
          this.addVeterinarias(veterinarias);
        } else {
          console.warn('El mapa no está listo para añadir veterinarias.');
        }
        this.isLoading = false;
      }
    });
  }
  
  mapState = { lat: this.lat, lng: this.lng, zoom: 11 };
  async createMap() {
    try {
      this.newMap = await GoogleMap.create({
        id: 'my-cool-map',
        element: this.mapRef.nativeElement,
        apiKey: environment.apiKey,
        config: this.getMapConfig(),
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
        lat: this.mapState.lat,
        lng: this.mapState.lng,
      },
      zoom: this.mapState.zoom,
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

  ngOnDestroy() {
    this.mapState.lat = this.lat;
    this.mapState.lng = this.lng; 
  }

  async addVeterinarias(veterinarias: Maps[]) {
    if (!this.newMap) {
      return;
    }
  
    for (const vet of veterinarias) {
      if (vet.Latitud && vet.Longitud) {
        const lat = parseFloat(vet.Latitud);
        const lng = parseFloat(vet.Longitud);
  
        if (!isNaN(lat) && !isNaN(lng)) {
          try {
            let svgColor;
            switch (vet.Categoria) {
              case 'Veterinarias Movil':
                svgColor = '#1D4ED8'; // Azul
                break;
              case 'Clinicas':
                svgColor = '#F59E0B'; // Amarillo
                break;
              case 'PetShops':
                svgColor = '#10B981'; // Verde
                break;
              case 'Peluquerias':
                svgColor = '#EF4444'; // Rojo
                break;
              case 'Veterinarias':
              default:
                svgColor = '#60A5FA'; // Azul claro
                break;
            }
  
            // Definir el SVG con el color específico
            const svgMarker = `
              <svg xmlns:x="http://ns.adobe.com/Extensibility/1.0/" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:graph="http://ns.adobe.com/Graphs/1.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" style="enable-background:new 0 0 100 100;" xml:space="preserve" width="40" height="50">
                <g i:extraneous="self">
                  <g>
                    <path fill="${svgColor}" d="M48.4,2.5C31.8,3.3,18.2,17.2,17.7,33.9c-0.2,8,2.5,15.3,7.1,21.1c6.8,8.5,12,18.1,15.8,28.3c1.3,3.5,2.5,6.9,3.6,10.1c1.9,5.5,9.7,5.5,11.6,0c1.1-3.2,2.3-6.6,3.6-10.1c3.7-10.1,8.7-19.7,15.5-28c4.6-5.6,7.4-12.7,7.4-20.5C82.3,16.4,67,1.7,48.4,2.5zM50,57.1c-12.3,0-22.3-10-22.3-22.3s10-22.3,22.3-22.3c12.3,0,22.3,10,22.3,22.3S62.3,57.1,50,57.1z"/>
                    <path fill="${svgColor}" d="M46.3,28.8c1.9-0.3,3-2.6,2.6-5c-0.4-2.4-2.3-4.1-4.2-3.7c-1.9,0.3-3,2.6-2.6,5C42.6,27.4,44.5,29.1,46.3,28.8z"/>
                    <path fill="${svgColor}" d="M41.4,35.9c1.7-0.6,2.4-2.8,1.7-5c-0.7-2.2-2.7-3.4-4.4-2.9c-1.7,0.6-2.4,2.8-1.7,5C37.7,35.2,39.7,36.5,41.4,35.9z"/>
                    <path fill="${svgColor}" d="M53.6,28.8c1.9,0.3,3.7-1.3,4.2-3.7c0.4-2.4-0.7-4.7-2.6-5c-1.9-0.3-3.7,1.3-4.2,3.7C50.6,26.2,51.7,28.4,53.6,28.8z"/>
                    <path fill="${svgColor}" d="M61.3,28.1c-1.7-0.6-3.6,0.7-4.4,2.9c-0.7,2.2,0,4.4,1.7,5c1.7,0.6,3.6-0.7,4.4-2.9C63.8,30.9,63,28.6,61.3,28.1z"/>
                  </g>
                </g>
              </svg>
            `;
  
            const base64Svg = `data:image/svg+xml;base64,${btoa(svgMarker)}`;
  
            const vetsId = await this.newMap.addMarker({
              coordinate: { lat, lng },
              title: vet.Nombre,
              snippet: `Dirección: ${vet.Direccion}\nDescripción: ${vet.Descripcion}`,
              iconUrl: base64Svg,
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

  goToVeterinariaDetails(veterinaria: Maps) {
    this.selectedPlace = veterinaria;
    this.isModalOpen = true;
    this.isShowingDetails = true;
    this.modal.setCurrentBreakpoint(0.98);
  }

  goBackToList() {
    this.isShowingDetails = false;
    this.selectedPlace = null;
  }

  dismiss() {
    this.modalController.dismiss();
    this.isModalOpen = false;
    this.goBackToList();
  }
  
  groupPlacesByCategoria(veterinarias: Maps[]): { [key: string]: Maps[] } {
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

  onFabClick() {
    this.isModalOpen = true;
  }

  setFabPosition() {
    if (this.platform.is('mobile')) {
      this.fabPosition = { vertical: 'top', horizontal: 'center' };
    } else {
      this.fabPosition = { vertical: 'top', horizontal: 'center' };
    }
  }

  async permisionLocation() {
    if (Capacitor.getPlatform() !== 'web') {
      const position = await this.locationPermitsService.getCurrentPosition();
      if (position) {
        this.lat = position.lat;
        this.lng = position.lng;
      } else {
        console.log('Se usaron coordenadas por defecto');
      }
    }
  }

  formatTimestampToTime(timestamp: Timestamp): string {
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  async checkPermissionAndLocation() {
    this.userPosition = await this.locationPermitsService.getCurrentPosition();
  }

  truncateText(text: string, limit: number): string {
    if (!text) {
      return '';
    }
    const words = text.split(' ');
    
    if (words.length > limit) {
      return words.slice(0, limit).join(' ') + '...';
    } else {
      return text;
    }
  }
}
