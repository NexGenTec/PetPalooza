export interface InfoAve {
    cuidados: Cuidados;
    origen: string;
    Año: string;
    Raza: string;
    Temperamento: Temperamento[];
    Longevidad: string;
    historia: string;
    id: number;
    imgPerfil: string;
    fechaCreacion: FechaCreacion;
    img: { [key: string]: string };
    CaractFisicas: CaractFisicas;
    categoria: string
}

export interface CaractFisicas {
    Cuerpo: string;
    Tamaño: string;
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
    Activos: string;
    Ejercitarse: string;
    Enfermedades: string;
}

export interface FechaCreacion {
    seconds: number;
    nanoseconds: number;
}
