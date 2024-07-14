export interface Dog {
    origen: string;
    fechaCreacion: FechaCreacion;
    Longevidad: string;
    Temperamento: Temperamento[];
    Año: string;
    historia: string;
    CaractFisicas: CaractFisicas;
    Img: { [key: string]: string };
    id: number;
    Raza: string;
    imgPerfil: string;
    cuidados: Cuidados;
}

export interface CaractFisicas {
    Peso: string;
    Cuerpo: string;
    Tamaño: string;
    Pelaje: string;
    Ojos: string;
    Cara: string;
    Orejas: string;
}

export interface Temperamento {
    descripcion: string;
    tipo: string;
    aplicable: boolean;
}

export interface Cuidados {
    "Visitas al veterinario": string;
    "Problemas de Salud": string;
    Cepillado: string;
    Ejercicio: string;
}

export interface FechaCreacion {
    seconds: number;
    nanoseconds: number;
}