export interface Cat {
    id: number;
    Raza: string;
    imgPerfil: string;
    img: ImagenesGato;
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
    'Alimentación': string;
    Salud: string[];
    Longevidad: string;
}

export interface ImagenesGato {
    1: string;
    2: string;
    3: string;
}
