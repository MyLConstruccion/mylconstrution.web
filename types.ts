
export interface MediaItem {
  url: string;
  type: 'image' | 'video';
}

export interface Project {
  id: string;
  title: string;
  location: string;
  category: 'Piletas' | 'Durlock' | 'Remodelación' | 'Pintura';
  url: string; // Imagen principal (portada)
  videoUrl?: string; // Video principal (opcional)
  media?: MediaItem[]; // Listado de todos los archivos
  date: string;
}

export interface Review {
  id: string;
  author: string;
  text: string;
  rating: number;
  date: string;
}

export enum Category {
  PILETAS = 'Piletas',
  DURLOCK = 'Durlock',
  REMODELACION = 'Remodelación',
  PINTURA = 'Pintura'
}
