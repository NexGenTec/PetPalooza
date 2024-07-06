export interface InfoGato {
    cuidados: Cuidados;
    origen: string;
    Anio: string;
    Raza: string;
    Temperamento: Temperamento[];
    Longevidad: string;
    historia: string;
    id: number;
    imgPerfil: string;
    fechaCreacion: FechaCreacion;
    img: { [key: string]: string };
    CaractFisicas: CaractFisicas;
}

export interface CaractFisicas {
    Cuerpo: string;
    Tamano: string;
    Colores: string;
    Pelaje: string;
}

export interface Temperamento {
    tipo: string;
    descripcion: string;
    aplicable: boolean;
}

export interface Cuidados {
    Entrenamiento: string;
    Cepillado: string;
    "Chequeos preventivos": string;
    Activos: string;
    Ejercitarse: string;
    Enfermedades: string;
}

export interface FechaCreacion {
    seconds: number;
    nanoseconds: number;
}
