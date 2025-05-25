export interface Evento {
  id?: number;
  // Usuario que creó el evento
  user_id?: number;
  user?: {
    name: string;
  };
  // Categoría del evento
  categoria_id: number;
  categoria?: {
    nombre: string;
  };
  // Detalles del evento
  nombre: string;
  descripcion: string;
  fecha_evento: string;
  ubicacion: string;
  premios?: string;
  inscripcion_abierta?: boolean;
  precio?: number;
  // Participantes inscritos
  inscripciones?: {
    id: number;
    name: string;
  }[];
  // Foto o archivo asociado al evento
  file?: {
    id?: number;
    file_path: string;
    name?: string;
  };
  estado?: boolean;
  verParticipantes?: boolean;
}