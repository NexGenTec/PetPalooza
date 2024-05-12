export interface InfoPerro {
    Origen: string;
    Raza: string;
    Img: { [key: string]: string };
    Category: string;
    Longevidad: string;
    "Características Físicas": CaracterísticasFísicas;
    imgPerfil: string;
    "Origen e Historia": string;
    id: number;
    "Cuidados y Salud": CuidadosYSalud;
    Temperamento: Temperamento[];
    Año: string;
    "Información Final": string;
}

export interface CaracterísticasFísicas {
    Tamaño: string;
    Pelaje: string;
    Cara: string;
    Peso: string;
    Ojos: string;
    Orejas: string;
    Cuerpo: string;
}

export interface CuidadosYSalud {
    "Visitas al veterinario\"": string;
    "Problemas de Salud": string;
    "Cuidado del Pelo": string;
    Ejercicio: string;
}

export interface Temperamento {
    descripcion: string;
    aplicable: boolean;
    tipo: string;
}
