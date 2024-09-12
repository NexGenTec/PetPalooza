export interface FechaCreacion {
    seconds: number;
    nanoseconds: number;
    isoString?: string;
  }
  
  export interface Cuidado {
    descripcion: string;
    tipo: string;
  }
  
  export interface Temperamento {
    tipo: string;
    descripcion: string;
  }
  
  export interface CaracteristicasFisicas {
    tipo: string;
    descripcion: string;
  }

  export interface ImgUser {
    url: string;
    nombre: string;
    likeCount?: number;
    smileCount?: number;
    likedDevices?: string[];
    reactedDevices?: string[];
  }
  
  export interface InfoPerro {
    Historia: string;
    Anio: string;
    Cuidados: Cuidado[];
    fechaCreacion: FechaCreacion;
    Img: any[];
    ImgUsers: ImgUser[]; 
    Temperamento: Temperamento[];
    Longevidad: string;
    Raza: string;
    caracteristicasFisicas: CaracteristicasFisicas[];
    imgPerfil: string;
    Origen: string;
    id?: string; // Propiedad id opcional
  }