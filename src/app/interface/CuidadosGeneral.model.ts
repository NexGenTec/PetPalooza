export interface CuidadosGeneral {
    tituloDieta?: string;
    id: string;
    ConsideracionFinal?: string;
    dietaPerro?: string;
    diferenciasDieta?: DiferenciasDieta;
    desventajasDieta?: DesventajasDieta;
    descripcion: string;
    tituloSeg: string;
    ventajasDieta?: VentajasDieta;
    descripDieta?: string;
    alimentoPerro?: Alimento;
    alimentoGato?: Alimento;
    "Prevención "?: Prevención;
    consejo?: string;
    comunGato?: ComunGato;
    comunPerro?: ComunPerro;
    enfermEstacional?: EnfermEstacional[];
    enfermedades?: Enfermedade[];
    conclusion?: string;
    "Controles y Chequeos Regulares"?: ControlesYChequeosRegulare[];
    "Programa de Vacunación Típico"?: ProgramaDeVacunaciónTípico[];
}

export interface ControlesYChequeosRegulare {
    segundo: string;
    etapa: string;
    tipo: string;
    tercero: string;
    primero: string;
    cuarto?: string;
    quinto?: string;
}

export interface Prevención {
    "Higiene Bucal": string;
    "Chequeos veterinarios Regulares": string;
    "Control de Parásitos": string;
    Vacunación: string;
    "Buena Alimentación": string;
}

export interface ProgramaDeVacunaciónTípico {
    tiempo: string;
    vacuna: string;
    "tipo "?: string;
    tipo?: string;
}

export interface Alimento {
    Grasas: string;
    "Aminoácidos esenciales"?: string;
    Proteínas: string;
    "Vitaminas y minerales": string;
    Carbohidratos?: string;
}

export interface ComunGato {
    "Diabetes Mellitus": string;
    "Inmunodeficiencia Felina (FIV)": string;
    "Leucemia Felina (FeLV)": string;
    Gastroenteritis: string;
    Hipertiroidismo: string;
    "Enfermedad Renal Crónica": string;
    "Enfermedad Dental": string;
}

export interface ComunPerro {
    Alergias: string;
    "Distemper (Moquillo Canino)": string;
    Gastroenteritis: string;
    Artritis: string;
    "Parvovirus Canino": string;
    "Enfermedad Dental": string;
    "Otitis Externa": string;
}

export interface DesventajasDieta {
    "Coste y Preparación": string;
    "Riesgo de Patógenos": string;
    "Desequilibrio Nutricional": string;
}

export interface DiferenciasDieta {
    Taurina: string;
    Carbohidratos: string;
    Proteínas: string;
}

export interface EnfermEstacional {
    "Parasitos Externos"?: string;
    "Alergias Estacionales:"?: string;
    "Golpe de Calor:"?: string;
    estacion: string;
    "Infecciones Respiratorias"?: string;
    "Problemas de articulaciones"?: string;
}

export interface Enfermedade {
    enfermedad: string;
    vacuna: string;
    tipo: Tipo;
    protege: string;
}

export enum Tipo {
    Gato = "Gato",
    Perro = "Perro",
}

export interface VentajasDieta {
    "Menos Procesados": string;
    "Nutrición Natural": string;
    "Dientes y Encías": string;
}