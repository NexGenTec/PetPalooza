export interface InfoGato {
    id: number;
    historia: string;
    Longevidad: string;
    Raza: string;
    img: { [key: string]: string }; // URLs de imágenes
    Temperamento: Temperamento[];
    origen: string;
    imgPerfil: string;
    cuidados: Cuidados;
    fechaCreacion: {
      seconds: number;
      nanoseconds: number;
    };
    Anio: string;
    CaractFisicas: CaracteristicasFisicas[];
  }
  
  export interface Temperamento {
    tipo: string;
    descripcion: string;
    aplicable: boolean;
  }
  
  export interface Cuidados {
    Entrenamiento: string;
    Cepillado: string;
    "Chequeos preventivos": string;
    Activos: string;
    Ejercitarse: string;
    Enfermedades: string;
  }
  
  export interface CaracteristicasFisicas {
    nombre: string;
    descripcion: string;
  }
  