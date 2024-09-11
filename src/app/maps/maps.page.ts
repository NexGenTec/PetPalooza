import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements AfterViewInit {

  @ViewChild('mapContainer', { static: false }) mapRef: ElementRef<HTMLElement>;
  newMap: GoogleMap;

  constructor() { }

  async ngAfterViewInit() {
    await this.createMap();
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
          zoom: 10,
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

      this.addCustomMarkers();

    } catch (error) {
      console.error('Error creating the map', error);
    }
  }

  private async addCustomMarkers() {
    const petvet = [
      { position: { lat: -33.4643, lng: -70.6010 }, title: "Veterinaria San Jorge", iconUrl: "assets/img/logo/small-vet-icon.png" },
      { position: { lat: -33.4594, lng: -70.6434 }, title: "Pet Shop Animales del Sur", iconUrl: "assets/img/logo/small-pet-shop-icon.png" },
      { position: { lat: -33.4340, lng: -70.6065 }, title: "Veterinaria VetCare", iconUrl: "assets/img/logo/small-vet-icon.png" },
      { position: { lat: -33.4382, lng: -70.6345 }, title: "Pet Shop Gato & Perro", iconUrl: "assets/img/logo/small-pet-shop-icon.png" },
      { position: { lat: -33.4727, lng: -70.6176 }, title: "Veterinaria Santiago Norte", iconUrl: "assets/img/logo/small-vet-icon.png" },
      { position: { lat: -33.4586, lng: -70.6303 }, title: "Pet Shop La Mascota Feliz", iconUrl: "assets/img/logo/small-pet-shop-icon.png" },
      { position: { lat: -33.4102, lng: -70.5569 }, title: "Veterinaria VetPlus", iconUrl: "assets/img/logo/small-vet-icon.png" },
      { position: { lat: -33.4344, lng: -70.6140 }, title: "Pet Shop Mundo Animal", iconUrl: "assets/img/logo/small-pet-shop-icon.png" },
      { position: { lat: -33.4054, lng: -70.5718 }, title: "Veterinaria San Francisco", iconUrl: "assets/img/logo/small-vet-icon.png" },
      { position: { lat: -33.4934, lng: -70.7784 }, title: "Pet Shop Animalia", iconUrl: "assets/img/logo/small-pet-shop-icon.png" }
    ];



    for (const marker of petvet) {
      await this.newMap.addMarker({
        coordinate: marker.position,
        title: marker.title,
        snippet: marker.title,
      });
    }
  }
}
