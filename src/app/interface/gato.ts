export interface Cat {
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
    img: ImagenesGato;
}
export interface CaracterísticasFísicas {
    'Tamaño': string;
    Peso: string;
    Cuerpo: string;
    Cabeza: string;
    Pelaje: string;
}

export interface Temperamento {
    tipo: string;
    descripcion: string;
    aplicable: boolean;
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
