export interface Dog {
    id: number;
    imgPerfil: string;
    Raza: string;
    Origen: string;
    Año: string;
    'Origen e Historia': string;
    'Características Físicas': CaracterísticasFísicas;
    Temperamento: Temperamento[];
    'Cuidados y Salud': CuidadosYSalud;
    Longevidad: string;
    'Información Final'?: string;
    img: ImagenesPerro;
}

export interface CaracterísticasFísicas {
    Tamaño: string;
    Peso: string;
    Cuerpo: string;
    Cara?: string;
    Ojos?: string;
    Orejas?: string;
    Pelaje: string;
    Cola?: string;
}

export interface Temperamento {
    tipo: string;
    descripcion: string;
    aplicable: boolean;
}

export interface CuidadosYSalud {
    Ejercicio: string;
    'Cuidado del Pelo': string;
    'Problemas de Salud': string[];
    'Visitas al veterinario'?: string;
    Temperatura?: string;
    Salud?: string[];
    Alimentación?: string;
}

export interface ImagenesPerro {
    1: string;
    2: string;
    3: string;
}
