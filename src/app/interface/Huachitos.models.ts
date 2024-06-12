export interface Huachitos {
    id: number;
    nombre: string;
    tipo: Tipo;
    color: Color;
    edad: string;
    estado: Estado;
    genero: Genero;
    descFisica: string;
    descPersonalidad: string;
    descAdicional: string;
    esterilizado: number;
    vacunas: number;
    imagen: string;
    equipo: Equipo;
    region: Region;
    comuna: string;
    url: string;
}

export type Color = "#F65B2A" | "#9370DB" | "#FFD700";

export type Equipo = "Privado" | "Fundación Aperrando" | "Fundación Nuevo Comienzo" | "Fundación Rescatando Huellas de Pucón";

export type Estado = "adopcion" | "encontrado";

export type Genero = "hembra" | "macho";

export type Region = "RM" | "Maule" | "O'Higgins" | "Tarapacá" | "Coquimbo" | "La Araucanía";

export type Tipo = "Perro" | "Gato" | "Conejo";
