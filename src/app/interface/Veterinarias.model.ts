import { Timestamp } from "firebase/firestore";
export interface Maps {
  id: string;
  Descripcion: string;
  Img: string;
  Web: string;
  Whatsapp: string;
  Facebook: string;
  Instagram: string;
  Direccion: string;
  Nombre: string;
  Categoria: string;
  Latitud: string;
  Longitud: string;
  Departure_time:Timestamp;
  Opening_time:Timestamp;
}
