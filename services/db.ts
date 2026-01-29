
import { createClient } from '@supabase/supabase-js';
import { Project, Review } from '../types';

const SUPABASE_URL = 'https://khbztfikqqmkklbajkps.supabase.co';
const SUPABASE_KEY = 'sb_publishable_80Nmz_Z5wCkWGJI058z3Gw_yCMK0U4T';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const getProjects = async (): Promise<Project[]> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(p => {
      let parsedMedia = [];
      try {
        parsedMedia = typeof p.media === 'string' ? JSON.parse(p.media) : (p.media || []);
      } catch (e) {
        parsedMedia = [];
      }

      if (parsedMedia.length === 0 && (p.url || p.video_url)) {
        if (p.url) parsedMedia.push({ url: p.url, type: 'image' });
        if (p.video_url) parsedMedia.push({ url: p.video_url, type: 'video' });
      }

      return {
        ...p,
        videoUrl: p.video_url,
        media: parsedMedia
      };
    });
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    return [];
  }
};

export const addProject = async (project: Omit<Project, 'id'>): Promise<Project | null> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        title: project.title,
        location: project.location,
        category: project.category,
        url: project.url,
        video_url: project.videoUrl,
        media: project.media,
        date: project.date
      }])
      .select();

    if (error) throw error;
    return data ? data[0] : null;
  } catch (error: any) {
    console.error('SQL Error:', error);
    return null;
  }
};

// --- NUEVA FUNCIÓN PARA MODIFICAR ---
export const updateProject = async (id: string, project: Omit<Project, 'id'>): Promise<Project | null> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update({
        title: project.title,
        location: project.location,
        category: project.category,
        url: project.url,
        video_url: project.videoUrl,
        media: project.media,
        date: project.date
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data ? data[0] : null;
  } catch (error: any) {
    console.error('Error al actualizar:', error);
    return null;
  }
};
// ------------------------------------

export const deleteProject = async (id: string) => {
  try {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  } catch (error) {
    console.error('Error al eliminar:', error);
  }
};

export const uploadFile = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('media') 
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('media').getPublicUrl(fileName);
    return data.publicUrl;
  } catch (error: any) {
    console.error('Storage Error:', error);
    return null;
  }
};

export const getReviews = async (): Promise<Review[]> => {
  try {
    const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    return [];
  }
};

export const addReview = async (review: Omit<Review, 'id' | 'date'>): Promise<Review | null> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert([{ 
        author: review.author, 
        text: review.text, 
        rating: review.rating,
        date: new Date().toISOString().split('T')[0] 
      }])
      .select();
    if (error) throw error;
    return data ? data[0] : null;
  } catch (error) {
    return null;
  }
};