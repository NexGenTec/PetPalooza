// import { Component, ElementRef, AfterViewInit, ViewChild, OnInit } from '@angular/core';
// import { GoogleMap } from '@capacitor/google-maps';
// import { AlertController, IonModal, ModalController, Platform } from '@ionic/angular';
// import { environment } from 'src/environments/environment';
// import { Maps } from '../interface/Veterinarias.model';
// import { FirestoreService } from '../service/firestore.service';
// import { Clipboard } from '@capacitor/clipboard';
// import { Capacitor } from '@capacitor/core';
// import { LocationpermitsService } from '../service/locationpermits.service';
// import { Timestamp } from "firebase/firestore";

// @Component({
//   selector: 'app-maps',
//   templateUrl: './maps.page.html',
//   styleUrls: ['./maps.page.scss'],
// })
// export class MapsPage implements AfterViewInit, OnInit {
//   lat = -33.4489;
//   lng = -70.6693;
//   isShowingDetails: boolean = false;
//   selectedPlace: Maps | null = null;
//   isModalOpen: boolean = false;
//   @ViewChild('modal', { static: false }) modal: IonModal;
//   @ViewChild('mapContainer', { static: false }) mapRef: ElementRef<HTMLElement>;
//   newMap: GoogleMap;
//   originalVeterinarias: Maps[] = [];
//   placeMarkers: Maps[] = [];
//   isLoading = true;
//   placeGroupedByCategoria: { [key: string]: Maps[] } = {};
//   skeletonMap = Array(2);
//   presentingElement = null;
//   fabPosition: { vertical: string; horizontal: string };
//   userPosition: { lat: number, lng: number } | null = null;

//   constructor(
//     private modalController: ModalController,
//     private firestores: FirestoreService,
//     private alertController: AlertController,
//     private platform: Platform,
//     private locationPermitsService: LocationpermitsService 
//   ) { }

//   ngOnInit() {
//     this.setFabPosition();
//     this.onFabClick();
//     this.permisionLocation();
//     this.checkPermissionAndLocation();
//   }

//   async ionViewWillEnter() {
//     await this.createMap();
//     if (this.newMap) {
//         await this.newMap.setCamera({
//             coordinate: {
//                 lat: this.mapState.lat,
//                 lng: this.mapState.lng
//             },
//             zoom: this.mapState.zoom,
//             bearing: 0,
//             angle: 0,
//             animate: true
//         });
//     }
//   }



//   async ngAfterViewInit() {
//     await this.createMap();
//     this.setMarkerClickListener();
//   }     

//   async doRefresh(event: any) {
//     console.log('Recargando datos...');
//     await this.loadData(); 
//     if (this.newMap) {
//       await this.addVeterinarias(this.originalVeterinarias); 
//       this.createMap();
//     }
//     event.target.complete();
//   }
  
//   refreshMap() {
//     this.loadData();
//     this.createMap();
//   }

//   /*/
//   Se llaman la coleccion de veterinaris
//   */
//   async loadData() {
//     this.isLoading = true;
//     await this.firestores.getCollectionChanges<Maps>('Maps').subscribe(veterinarias => {
//       if (veterinarias) {
//         this.originalVeterinarias = veterinarias;
//         this.placeGroupedByCategoria = this.groupPlacesByCategoria(this.originalVeterinarias);
//         if (this.newMap) {
//           this.addVeterinarias(veterinarias);
//         } else {
//           console.warn('El mapa no está listo para añadir veterinarias.');
//         }
//         this.isLoading = false;
//       }
//     });
//   }
  
//   mapState = { lat: this.lat, lng: this.lng, zoom: 11 };
//   async createMap() {
//     try {
//       this.newMap = await GoogleMap.create({
//         id: 'my-cool-map',
//         element: this.mapRef.nativeElement,
//         apiKey: environment.apiKey,
//         config: this.getMapConfig(),
//       });
//       await this.loadData(); 
//     } catch (error) {
//       const alert = await this.alertController.create({
//         header: 'Error',
//         mode:'ios',
//         message: 'No se pudo cargar el mapa. Intenta nuevamente más tarde.',
//         buttons: ['OK']
//       });
//       await alert.present();
//       console.error('Error creando el mapa', error);
//     }
//   }

//   private getMapConfig() {
//     return {
//       center: {
//         lat: this.mapState.lat,
//         lng: this.mapState.lng,
//       },
//       zoom: this.mapState.zoom,
//       styles: [
//         {
//           "elementType": "geometry",
//           "stylers": [
//             {
//               "color": "#e0e0e0"
//             }
//           ]
//         },
//         {
//           "elementType": "labels.icon",
//           "stylers": [
//             {
//               "visibility": "off"
//             }
//           ]
//         },
//         {
//           "elementType": "labels.text.fill",
//           "stylers": [
//             {
//               "color": "#616161"
//             }
//           ]
//         },
//         {
//           "elementType": "labels.text.stroke",
//           "stylers": [
//             {
//               "color": "#f5f5f5"
//             }
//           ]
//         },
//         {
//           "featureType": "administrative.land_parcel",
//           "elementType": "labels.text.fill",
//           "stylers": [
//             {
//               "color": "#bdbdbd"
//             }
//           ]
//         },
//         {
//           "featureType": "poi",
//           "elementType": "geometry",
//           "stylers": [
//             {
//               "color": "#eeeeee"
//             }
//           ]
//         },
//         {
//           "featureType": "poi",
//           "elementType": "labels.text.fill",
//           "stylers": [
//             {
//               "color": "#757575"
//             }
//           ]
//         },
//         {
//           "featureType": "poi.park",
//           "elementType": "geometry",
//           "stylers": [
//             {
//               "color": "#e5e5e5"
//             }
//           ]
//         },
//         {
//           "featureType": "poi.park",
//           "elementType": "labels.text.fill",
//           "stylers": [
//             {
//               "color": "#9e9e9e"
//             }
//           ]
//         },
//         {
//           "featureType": "road",
//           "elementType": "geometry",
//           "stylers": [
//             {
//               "color": "#ffffff"
//             }
//           ]
//         },
//         {
//           "featureType": "road.arterial",
//           "elementType": "labels.text.fill",
//           "stylers": [
//             {
//               "color": "#757575"
//             }
//           ]
//         },
//         {
//           "featureType": "road.highway",
//           "elementType": "geometry",
//           "stylers": [
//             {
//               "color": "#ffffff"
//             }
//           ]
//         },
//         {
//           "featureType": "road.highway",
//           "elementType": "labels.text.fill",
//           "stylers": [
//             {
//               "color": "#616161"
//             }
//           ]
//         },
//         {
//           "featureType": "transit",
//           "elementType": "geometry",
//           "stylers": [
//             {
//               "color": "#f5f5f5"
//             }
//           ]
//         },
//         {
//           "featureType": "transit.station",
//           "elementType": "labels.text.fill",
//           "stylers": [
//             {
//               "color": "#757575"
//             }
//           ]
//         },
//         {
//           "featureType": "water",
//           "elementType": "geometry",
//           "stylers": [
//             {
//               "color": "#b4c6e0"
//             }
//           ]
//         },
//         {
//           "featureType": "water",
//           "elementType": "labels.text.fill",
//           "stylers": [
//             {
//               "color": "#ffffff"
//             }
//           ]
//         }
//       ],
//     };
//   }

//   ngOnDestroy() {
//     this.mapState.lat = this.lat;
//     this.mapState.lng = this.lng; 
//   }

//   async addVeterinarias(veterinarias: Maps[]) {
//     if (!this.newMap) {
//       return;
//     }
  
//     for (const vet of veterinarias) {
//       if (vet.Latitud && vet.Longitud) {
//         const lat = parseFloat(vet.Latitud);
//         const lng = parseFloat(vet.Longitud);
  
//         if (!isNaN(lat) && !isNaN(lng)) {
//           try {
//             let svgColor;
//             switch (vet.Categoria) {
//               case 'Veterinarias Movil':
//                 svgColor = '#1D4ED8'; // Azul
//                 break;
//               case 'Clinicas':
//                 svgColor = '#F59E0B'; // Amarillo
//                 break;
//               case 'PetShops':
//                 svgColor = '#10B981'; // Verde
//                 break;
//               case 'Peluquerias':
//                 svgColor = '#EF4444'; // Rojo
//                 break;
//               case 'Veterinarias':
//               default:
//                 svgColor = '#60A5FA'; // Azul claro
//                 break;
//             }
//             const svgMarker = `
//             <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 66 82.5" enable-background="new 0 0 66 66" xml:space="preserve" width="40" height="50">
//               <g>
//                 <g>
//                   <path fill="${svgColor}" d="M33,1.75C19.24,1.75,8.09,12.9,8.09,26.66c0,10.72,6.78,19.87,16.29,23.38L33,64.25l8.62-14.21c9.51-3.51,16.29-12.66,16.29-23.38C57.91,12.9,46.76,1.75,33,1.75z M33,45.9228c-10.642,0-19.2725-8.6209-19.2725-19.2629C13.7274,16.0082,22.358,7.3873,33,7.3873c10.6421,0,19.2725,8.6209,19.2725,19.2725C52.2725,37.3018,43.6421,45.9228,33,45.9228z"/>
//                   <g>
//                     <path d="M22.4208,28.5474c-1.6165-0.5451-2.6064-1.7731-3.3457-3.2204c-0.8083-1.5914-1.2155-3.258-0.7268-5.0436c0.5715-2.0928,2.7262-2.9509,5.4258,0.0125c1.0839,1.1904,1.748,3.0074,1.8608,4.6051c0.0439,0.0125-0.1065,1.6541-0.401,2.4059C24.7766,28.4909,23.6238,28.9609,22.4208,28.5474z"/>
//                     <path d="M37.915,40.4014c-3.7118-0.3426-5.8134-0.6293-10.2375-0.4574c-6.1471,0.2276-7.4123-6.3137-3.5713-8.7652c1.8271-1.1382,2.1659-0.7446,4.8995-4.4108c0.4449-0.6014,0.8772-1.228,1.4097-1.7417c1.2969-1.228,2.9134-1.2468,4.2479-0.0689c1.7637,1.5378,2.4246,3.933,6.5347,7.6625C43.459,34.6807,44.019,39.6706,37.915,40.4014z"/>
//                     <path d="M43.8233,29.4558c-1.7338,0.7919-3.4539,0.1337-3.6715-2.4748c0.094-2.9573,1.1904-5.4007,3.8407-6.9044c1.8608-1.0588,3.4961-0.1629,3.8156,1.9485C48.2152,24.7568,46.298,28.328,43.8233,29.4558z"/>
//                     <path d="M26.4807,14.1872c0.921-1.4598,2.4122-1.6916,3.7279-0.5701c1.9443,1.6508,2.7889,5.5222,1.5663,8.2703c-1.0022,2.2681-3.3022,2.5162-4.8556,0.2444C25.4098,19.9422,25.1011,16.3567,26.4807,14.1872z"/>
//                     <path d="M36.1231,14.5067c0.6516-0.733,1.4598-1.2718,2.4685-1.3094c1.1842-0.0501,2.1741,0.9335,2.4498,2.3558c0.4933,2.4672-0.3144,5.6064-2.7755,7.5246c-1.4097,1.1027-2.9698,0.802-3.7655-0.6641C33.5601,20.6275,33.7407,17.1946,36.1231,14.5067z"/>
//                   </g>
//                 </g>
//               </g>
//             </svg>
//           `;
  
//             const base64Svg = `data:image/svg+xml;base64,${btoa(svgMarker)}`;
  
//             const vetsId = await this.newMap.addMarker({
//               coordinate: { lat, lng },
//               title: vet.Nombre,
//               snippet: `Dirección: ${vet.Direccion}\nDescripción: ${vet.Descripcion}`,
//               iconUrl: base64Svg,
//             });
//             this.placeMarkers[vetsId] = vet;
//           } catch (error) {
//             console.error(`Error al añadir marcador para ${vet.Nombre}:`, error);
//           }
//         } else {
//           console.warn(`Coordenadas no válidas para la veterinaria: ${vet.Nombre}`, vet);
//         }
//       } else {
//         console.warn(`Localización no definida para la veterinaria: ${vet.Nombre}`, vet);
//       }
//     }
//   }    

//   setMarkerClickListener() {
//     this.newMap.setOnMarkerClickListener(async (data) => {
//       const vet = this.placeMarkers[data.markerId];
//       if (vet) {
//         const alert = await this.alertController.create({
//           mode: 'ios',
//           header: vet.Nombre,
//           message: `Dirección: ${vet.Direccion}`,
//           buttons: [
//             {
//               text: 'Ir al lugar',
//               handler: () => {
//                 this.goToVeterinariaDetails(vet);
//               }
//             },
//             {
//               text: 'Copiar',
//               handler: async () => {
//                 await Clipboard.write({
//                   string: `Nombre: ${vet.Nombre}\nDirección: ${vet.Direccion}`
//                 });
//               }
//             },
//           ]
//         });
//         await alert.present();
//       }
//     });
//   }

//   goToVeterinariaDetails(veterinaria: Maps) {
//     this.selectedPlace = veterinaria;
//     this.isModalOpen = true;
//     this.isShowingDetails = true;
//     this.modal.setCurrentBreakpoint(0.98);
//   }

//   goBackToList() {
//     this.isShowingDetails = false;
//     this.selectedPlace = null;
//   }

//   dismiss() {
//     this.modalController.dismiss();
//     this.isModalOpen = false;
//     this.goBackToList();
//   }
  
//   groupPlacesByCategoria(veterinarias: Maps[]): { [key: string]: Maps[] } {
//     return veterinarias.reduce((grouped, veterinaria) => {
//       const categoria = veterinaria.Categoria;
//       if (!grouped[categoria]) {
//         grouped[categoria] = [];
//       }
//       grouped[categoria].push(veterinaria);
//       return grouped;
//     }, {});
//   }

//   getObjectKeys(obj: any): string[] {
//     return Object.keys(obj);
//   }

//   onFabClick() {
//     this.isModalOpen = true;
//   }

//   setFabPosition() {
//     if (this.platform.is('mobile')) {
//       this.fabPosition = { vertical: 'top', horizontal: 'center' };
//     } else {
//       this.fabPosition = { vertical: 'top', horizontal: 'center' };
//     }
//   }

//   async permisionLocation() {
//     if (Capacitor.getPlatform() !== 'web') {
//       const position = await this.locationPermitsService.getCurrentPosition();
//       if (position) {
//         this.lat = position.lat;
//         this.lng = position.lng;
//       } else {
//         console.log('Se usaron coordenadas por defecto');
//       }
//     }
//   }

//   formatTimestampToTime(timestamp: Timestamp): string {
//     const date = timestamp.toDate();
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   }

//   async checkPermissionAndLocation() {
//     this.userPosition = await this.locationPermitsService.getCurrentPosition();
//   }

//   truncateText(text: string, limit: number): string {
//     if (!text) {
//       return '';
//     }
//     const words = text.split(' ');
    
//     if (words.length > limit) {
//       return words.slice(0, limit).join(' ') + '...';
//     } else {
//       return text;
//     }
//   }
// }
