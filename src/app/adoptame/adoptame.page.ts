import { Component, OnInit } from '@angular/core';
import { Patrocinadores } from '../interface/Patrocinadores.models';
import { FirestoreService } from '../service/firestore.service';
import { HuachitoService } from '../service/huachito.service';
import { Huachitos } from '../interface/Huachitos.models';

@Component({
  selector: 'app-adoptame',
  templateUrl: './adoptame.page.html',
  styleUrls: ['./adoptame.page.scss'],
})
export class AdoptamePage implements OnInit {

  Patrocinadores: Patrocinadores[] = [];
  huachito: Huachitos[] = [];
  currentDatoIndex: number = 0;
  texto1showSkeleton: boolean = true;
  showSkeletonPerros: boolean = true;
  mostrarError500: boolean = true;

  colorsCards = [
    { id: 1, bg: '#FFEBE5', text: '#7e402d' },
    { id: 2, bg: '#FDF1DB', text: '#6e5628' },
    { id: 3, bg: '#CFECFF', text: '#215a80' }
  ];

  constructor(
    private firestores: FirestoreService,
    private huachitoService: HuachitoService,
  ) {
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
    this.firestores.getCollectionChanges<Patrocinadores>('Patrocinadores').subscribe(dato => {
      if (dato) {
        this.Patrocinadores = dato;
        console.log(this.Patrocinadores)
      }
    });
  }
  getHuachitos() {
    this.huachitoService.getAnimales().subscribe(
      (data) => {
        if (data && data.data) {
          this.huachito = data.data;
          this.texto1showSkeleton = false;
        }
      },
      (error) => {
        console.error('Error al cargar los datos de huachitos:', error);
        if (error.status === 500) {
          this.mostrarError500 = true;
        }
      }
    );
  }
  adoptar(url: string) {
    window.open(url, '_blank'); // Abre la URL en una nueva pestaña
  }
}
