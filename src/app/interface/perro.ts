export interface Dog {
    id: number;
    Raza: string;
    img: ImagenesPerro;
    Origen: string;
    Año: string;
    'Origen e Historia': string;
    'Características Físicas': CaracterísticasFísicas;
    Temperamento: Temperamento;
    'Cuidados y Salud': CuidadosYSalud;
}
export interface CaracterísticasFísicas {
    'Tamaño': string;
    Peso: string;
    Cuerpo: string;
    Cabeza: string;
    Pelaje: string;
}

export interface Temperamento {
    Tranquilo: boolean;
    Afectuoso: boolean;
    Sociable: boolean;
    Inteligente: boolean;
    Vocal: boolean;
}

export interface CuidadosYSalud {
    Cepillado: string;
    Alimentación: string;
    Salud: string[];
    Longevidad: string;
}

export interface ImagenesPerro {
    1: string;
    2: string;
    3: string;
}
