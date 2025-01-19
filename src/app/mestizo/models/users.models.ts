export interface Users {
    id?: string; // El ID se autogenera en Firestore
    nombre: string;
    apellido: string;
    imagen: string; // URL de la imagen almacenada en Firebase Storage
    createdAt: Date; // Fecha de creación (Timestamp)
}
