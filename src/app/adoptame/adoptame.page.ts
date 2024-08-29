import { Component, OnInit } from '@angular/core';
import { fundaciones } from '../interface/Fundaciones.model';
import { FirestoreService } from '../service/firestore.service';
import { HuachitoService } from '../service/huachito.service';
import { Huachitos, Tipo } from '../interface/Huachitos.models';
import { ModalController } from '@ionic/angular';
import { ImgModalPage } from '../components/img-modal/img-modal.page';
import { InfoImage } from '../interface/InfoImage.models';

@Component({
  selector: 'app-adoptame',
  templateUrl: './adoptame.page.html',
  styleUrls: ['./adoptame.page.scss'],
})
export class AdoptamePage implements OnInit {

  
  fundaciones: fundaciones[] = [];
  huachito: Huachitos[] = [];
  currentDatoIndex: number = 0;
  texto1showSkeleton: boolean = true;
  showSkeletonPerros: boolean = true;
  mostrarError500: boolean = true;
  originalImg: InfoImage[] = [];
  img: InfoImage[] = [];
  tipos: Tipo[] = ["Perro", "Gato", "Conejo", "Roedor", "Ave"];

  colorsCards = [
    { id: 1, bg: '#FFEBE5', text: '#7e402d' },
    { id: 2, bg: '#FDF1DB', text: '#6e5628' },
    { id: 3, bg: '#CFECFF', text: '#215a80' }
  ];

  constructor(
    private firestores: FirestoreService,
    private huachitoService: HuachitoService,
    private modalController: ModalController,
  ) {
  }

  ionViewDidEnter() {
  }

  ngOnInit(): void {

    this.getQuirkyFacts();
    this.getHuachitos();
    setInterval(() => {
    }, 10000);
    setTimeout(() => {
      this.texto1showSkeleton = false;
      this.showSkeletonPerros = false;
    }, 3000);
  }

  getQuirkyFacts() {
    this.firestores.getCollectionChanges<fundaciones>('fundaciones').subscribe(dato => {
      if (dato) {
        this.fundaciones = dato;
      }
    });
    this.firestores.getCollectionChanges<InfoImage>('InfoImage').subscribe(img => {
      if (img) {
        this.originalImg = img;
        this.img = img
      }
    });
  }
  refugio(url: string) {
    window.open(url, '_blank'); // Abre la URL en una nueva pestaña
  }
  getHuachitos() {
    this.huachitoService.getAnimales().subscribe({
      next: (data) => {
        if (data && data.data) {
          this.huachito = data.data;
          this.texto1showSkeleton = false;
          this.mostrarError500 = false;
        }
      },
      error: (error) => {
        console.error('Error al cargar los datos de huachitos:', error);
        if (error.status === 500) {
          this.mostrarError500 = true;
        }
      }
    });
  }

  filtrarPorTipo(tipo: Tipo): Huachitos[] {
    return this.huachito.filter(animal => animal.tipo === tipo);
  }

  webUrl = 'https://huachitos.cl/'

  adoptar(url: string) {
    window.open(url, '_blank'); // Abre la URL en una nueva pestaña
  }
  verWeb(webUrl: string) {
    window.open(webUrl, '_blank'); // Abre la URL en una nueva pestaña
  }

  async openModal(imageUrl: string) {
    const modal = await this.modalController.create({
      component: ImgModalPage,
      componentProps: {
        imageUrl: imageUrl
      }
    });
    return await modal.present();
  }
}
