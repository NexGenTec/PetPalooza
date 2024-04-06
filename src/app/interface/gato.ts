interface Cat {
    id: number;
    Raza: string;
    imgPerfil: string;
    Origen: string;
    'Año': string;
    'Origen e Historia': string;
    'Características Físicas': CaracterísticasFísicas;
    Temperamento: Temperamento;
    'Cuidados y Salud': CuidadosYSalud;
}

interface CuidadosYSalud {
    Cepillado: string;
    'Alimentación': string;
    Salud: string[];
    Longevidad: string;
}

interface Temperamento {
    Tranquilo: boolean;
    Afectuoso: boolean;
    Sociable: boolean;
    Inteligente: boolean;
    Vocal: boolean;
}

interface CaracterísticasFísicas {
    'Tamaño': string;
    Peso: string;
    Cuerpo: string;
    Cabeza: string;
    Pelaje: string;
}

interface ImagenesGato {
    1: string;
    2: string;
    3: string;
}
