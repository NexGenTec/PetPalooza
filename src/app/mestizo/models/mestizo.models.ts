export interface Mestizos {
    nombre: string; // Nombre del dueño o usuario que registra
    apellido: string; // Apellido del dueño o usuario que registra
  
    // Datos básicos de la mascota
    apodo: string; // Apodo de la mascota
    especie: string; // Especie de la mascota (e.g., perro, gato)
    sexo: string; // Sexo de la mascota (e.g., macho, hembra)
    edad: string; // Edad de la mascota (e.g., meses o años)
    nacionalidad: string; // Nacionalidad o país de origen de la mascota
  
    // Características físicas de la mascota
    caracteristicasFisicas: {
      tamano: string; // Tamaño de la mascota (e.g., grande, mediano, pequeño)
      peso: string; // Peso de la mascota
      pelaje: string; // Tipo de pelaje (e.g., corto, largo)
      color: string; // Color de la mascota
      ojos: string; // Color o características de los ojos
    };
  
    // Información de temperamento
    temperamentos: string[]; // Array con al menos 3 temperamentos (e.g., juguetón, tímido)
  
    // Historia de la mascota
    historia: string; // Historia del mestizo
  
    // Imagen de la mascota
    imagenMascota: {
      url: string; // URL de la imagen subida
      nombreArchivo?: string; // Opcional: nombre del archivo subido
    };
  }
  