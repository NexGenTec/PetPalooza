export interface InfoGato {
    imgPerfil: string;
    origenEHistoria: string;
    longevidad: string;
    año: string;
    fechaCreacion: FechaCreacion;
    cuidadosYSalud: CuidadosYSalud;
    origen: string;
    temperamento: Temperamento[];
    Raza: string;
    id: string;
    característicasFísicas: CaracterísticasFísicas;
    img: { [key: string]: string };
}

export interface CaracterísticasFísicas {
    pelaje: string;
    cabeza: string;
    cuerpo: string;
}

export interface CuidadosYSalud {
    alimentación: string;
    salud: string;
    cepillado: string;
}

export interface FechaCreacion {
    seconds: number;
    nanoseconds: number;
}

export interface Temperamento {
    tipo: string;
    descripcion: string;
    aplicable: boolean;
}
