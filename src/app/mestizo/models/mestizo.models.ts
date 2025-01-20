export interface Mestizos {
  nombre: string;
  apellido: string;
  apodo: string;
  especie: string;
  sexo: string;
  edad: string;
  nacionalidad: string;
  caracteristicasFisicas: {
    tamano: string;
    peso: string;
    pelaje: string;
    color: string;
    ojos: string;
  };
  temperamentos: string[];
  historia: string;
  imagenMascota: {
    url: string;
    nombreArchivo?: string;
  };
  createdAt: Date;
}