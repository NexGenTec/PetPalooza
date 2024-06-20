export interface fundaciones {
    ubicacion: string;
    nombre: string;
    descripcion: string;
    logo: string;
    fecha: Date;
    social: Social;
}

export interface Social {
    facebook : string;
    instagram: string;
    sitioWeb: string;
    whatsApp: string;
}