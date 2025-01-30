export interface Users {
    id?: string;
    nombre: string;
    apellido: string;
    imagen: string;
    createdAt: Date;
    mascotas?: Mestizos[];
}


export interface Mestizos {
    id?:string;
    nombre: string;
    apellido: string;
    apodo: string;
    especie: string;
    sexo: string;
    edad: string;
    unidadEdad: 'mes' | 'anio';
    nacionalidad: string;
    tamano: string;
    peso: string;
    pelaje: string;
    color: string;
    ojos: string;
    temperamentos: string[];
    historia: string;
    imagenMascota: string[]
    createdAt: Date;
}