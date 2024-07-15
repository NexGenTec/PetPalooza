import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InfoGato } from 'src/app/interface/InfoGato.models';
import { FirestoreService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-cat',
  templateUrl: './cat.page.html',
  styleUrls: ['./cat.page.scss'],
})
export class CatPage implements OnInit {

  gatos: InfoGato[] = [];
  filteredGatos: InfoGato[] = [];
  favorites: any[] = [];
  currentDatoIndex: number = 0;
  searchTerm: string = '';
  newGato: InfoGato = {
    cuidados: {
      Entrenamiento: '',
      Cepillado: '',
      "Chequeos preventivos": '',
      Activos: '',
      Ejercitarse: '',
      Enfermedades: ''
    },
    origen: '',
    Anio: '',
    Raza: '',
    Temperamento: [],
    Longevidad: '',
    historia: '',
    id: 0,
    imgPerfil: '',
    fechaCreacion: { seconds: 0, nanoseconds: 0 },
    img: {},
    CaractFisicas: { Cuerpo: '', Tamano: '', Colores: '', Pelaje: '' }
  };

  cuidadoKey: string = '';
  cuidadoValue: string = '';



  constructor(
    private firestores: FirestoreService,
    private router: Router,
  ) {
    
  }


  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.firestores.getCollectionChanges<InfoGato>('InfoGato').subscribe(gato => {
      if (gato) {
        this.gatos = gato
        this.filteredGatos = [...this.gatos];
        console.log(this.gatos)
      }
    })
  }

  navigateToTargetPage(segment: string, gato: InfoGato) {
    this.router.navigate([segment, gato.id], { state: { data: gato } });
  }

  filterGatos() {
    console.log('Search term:', this.searchTerm);
    this.filteredGatos = this.gatos.filter(gato =>
      gato.Raza.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    console.log('Filtered gatos:', this.filteredGatos);
  }

  addGato(form: any) {
    if (form.valid) {
      const newGatoWithId = { ...this.newGato, id: Date.now() };
      this.firestores.addDocument<InfoGato>('InfoGato', newGatoWithId).then(() => {
        this.resetNewGatoForm();
        this.loadData();
        form.reset();
      });
    }
  }

  editGato(gato: InfoGato) {
    // Lógica para editar gato
    this.newGato = { ...gato };
  }

  updateGato(form: any) {
    if (form.valid) {
      this.firestores.updateDocument<InfoGato>('InfoGato', this.newGato.id.toString(), this.newGato).then(() => {
        this.resetNewGatoForm();
        this.loadData();
        form.reset();
      });
    }
  }

  deleteGato(gato: InfoGato) {
    this.firestores.deleteDocument('InfoGato', gato.id).then(() => {
      this.loadData();
    });
  }

  resetNewGatoForm() {
    this.newGato = {
      cuidados: {
        Entrenamiento: '',
        Cepillado: '',
        "Chequeos preventivos": '',
        Activos: '',
        Ejercitarse: '',
        Enfermedades: ''
      },
      origen: '',
      Anio: '',
      Raza: '',
      Temperamento: [],
      Longevidad: '',
      historia: '',
      id: 0,
      imgPerfil: '',
      fechaCreacion: { seconds: 0, nanoseconds: 0 },
      img: {},
      CaractFisicas: { Cuerpo: '', Tamano: '', Colores: '', Pelaje: '' }
    };
  }
  addTemperamento() {
    this.newGato.Temperamento.push({ tipo: '', descripcion: '', aplicable: true });
  }

  removeTemperamento(index: number) {
    this.newGato.Temperamento.splice(index, 1);
  }

  getCuidadosKeys() {
    return Object.keys(this.newGato.cuidados);
  }
  

  addCuidado(cuidadoKey: string, cuidadoValue: string) {
    if (cuidadoKey && cuidadoValue) {
      this.newGato.cuidados[cuidadoKey] = cuidadoValue;
      this.cuidadoKey = ''; // Clear input fields after adding
      this.cuidadoValue = '';
    }
  }
  
  removeCuidado(cuidadoKey: string) {
    delete this.newGato.cuidados[cuidadoKey];
  }
}