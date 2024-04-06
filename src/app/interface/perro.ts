interface Dog {
    id: number;
    Raza: string;
    Origen: string;
    'Año': string;
    'Origen e Historia': string;
    'Características Físicas': CaractersticasFsicas;
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
interface CaractersticasFsicas {
    'Tamaño': string;
    Peso: string;
    Cuerpo: string;
    Cabeza: string;
    Pelaje: string;
}