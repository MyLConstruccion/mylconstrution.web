import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, addProject, deleteProject, uploadFile, updateProject } from '../services/db';
import { Project, Category, MediaItem } from '../types';
import { Icons, APP_CONFIG } from '../constants';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(() => sessionStorage.getItem('myl_admin_auth') === 'true');
  const [password, setPassword] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    title: '', location: '', category: Category.PILETAS, url: '', videoUrl: '',
    media: [], date: new Date().toISOString().split('T')[0]
  });

  const [selectedFiles, setSelectedFiles] = useState<{file: File, preview: string}[]>([]);

  useEffect(() => {
    if (isAuthorized) loadData();
  }, [isAuthorized]);

  const loadData = async () => {
    setLoading(true);
    const data = await getProjects();
    setProjects(data);
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === APP_CONFIG.adminPassword) {
      setIsAuthorized(true);
      sessionStorage.setItem('myl_admin_auth', 'true');
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingMedia = (index: number) => {
    if (window.confirm('¿Estás seguro de que quieres quitar este archivo?')) {
      setFormData(prev => ({
        ...prev,
        media: prev.media.filter((_, i) => i !== index)
      }));
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      location: project.location,
      category: project.category,
      url: project.url,
      videoUrl: project.videoUrl || '',
      media: project.media || [],
      date: project.date
    });
    setSelectedFiles([]); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || (selectedFiles.length === 0 && formData.media.length === 0)) {
      alert('Agrega un título y al menos una foto o video.');
      return;
    }

    setLoading(true);
    const mediaList: MediaItem[] = [...formData.media];

    try {
      // Subida de archivos a Cloudinary uno por uno
      for (let i = 0; i < selectedFiles.length; i++) {
        setUploadProgress(`Subiendo archivo ${i + 1} de ${selectedFiles.length}...`);
        const { file } = selectedFiles[i];
        
        // Esta función ahora usa la API REST de Cloudinary con f_auto,q_auto
        const optimizedUrl = await uploadFile(file);
        
        if (optimizedUrl) {
          const type = file.type.startsWith('video') ? 'video' : 'image';
          mediaList.push({ url: optimizedUrl, type });
        }
      }

      const firstImage = mediaList.find(m => m.type === 'image')?.url;
      const firstVideo = mediaList.find(m => m.type === 'video')?.url;

      const finalProject = {
        ...formData,
        url: firstImage || (mediaList.length > 0 ? mediaList[0].url : ''),
        videoUrl: firstVideo || '',
        media: mediaList
      };

      setUploadProgress('Guardando en Base de Datos...');
      
      let result;
      if (editingId) {
        result = await updateProject(editingId, finalProject);
      } else {
        result = await addProject(finalProject);
      }
      
      if (result) {
        alert(editingId ? '✅ Obra actualizada correctamente' : '✅ Obra publicada con éxito');
        resetForm();
        loadData();
      }
    } catch (error) {
      alert('Error en la operación');
    } finally {
      setLoading(false);
      setUploadProgress('');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: '', location: '', category: Category.PILETAS, url: '', videoUrl: '', media: [], date: new Date().toISOString().split('T')[0] });
    setSelectedFiles([]);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-white">
        <div className="w-full max-w-md bg-[#111] border border-white/5 p-12 rounded-[3rem] text-center shadow-2xl">
          <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter">Acceso Admin</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="password" placeholder="Contraseña" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-center font-bold focus:border-[#fbbf24] outline-none" value={password} onChange={e => setPassword(e.target.value)} autoFocus />
            <button className="w-full bg-[#fbbf24] text-black py-5 rounded-2xl font-black uppercase">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#050505] text-white font-sans">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
             <button onClick={() => navigate('/')} className="bg-white/5 border border-white/10 px-8 py-4 rounded-full hover:bg-[#fbbf24] hover:text-black transition-all font-black uppercase text-[10px]">
              ← Volver a la Web
            </button>
            <div>
              <span className="text-[#fbbf24] font-black uppercase tracking-[0.6em] text-[10px]">Portal de Control</span>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">ADMIN</h1>
            </div>
          </div>
          <button onClick={() => { setIsAuthorized(false); sessionStorage.removeItem('myl_admin_auth'); }} className="px-8 py-4 text-white/40 text-[10px] font-black uppercase tracking-widest rounded-full border border-white/10 hover:bg-red-500 hover:text-white transition-all">
            Cerrar Sesión
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 bg-[#111] p-10 rounded-[4rem] border border-white/5 h-fit shadow-2xl">
            <h3 className="text-2xl font-black mb-10 uppercase">
                {editingId ? 'Editar Obra' : 'Nueva Obra'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#fbbf24] font-bold" placeholder="Título" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              <input className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#fbbf24] font-bold" placeholder="Ubicación" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
              
              <div className="grid grid-cols-2 gap-4">
                <select className="bg-black border border-white/10 rounded-2xl px-6 py-4 font-black text-[10px] uppercase tracking-wider outline-none focus:border-[#fbbf24]" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})}>
                  <option value="Piletas">Piletas</option>
                  <option value="Construcción">Construcción</option>
                  <option value="Durlock">Durlock</option>
                  <option value="Remodelación">Remodelación</option>
                  <option value="Pintura">Pintura</option>
                </select>
                <input type="date" className="bg-black border border-white/10 rounded-2xl px-6 py-4 font-bold" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>

              {/* Input de Galería Nativa - Mantenido al 100% */}
              <div className="bg-black/50 p-8 rounded-[2.5rem] border-2 border-dashed border-white/10 hover:border-[#fbbf24] transition-all text-center">
                <p className="text-[#fbbf24] text-[10px] font-black uppercase mb-4">Añadir Fotos o Videos:</p>
                <input 
                    type="file" 
                    multiple 
                    accept="image/*,video/*" 
                    onChange={handleFileChange} 
                    className="hidden" 
                    id="file-upload" 
                />
                <label htmlFor="file-upload" className="inline-block px-8 py-3 bg-white/5 text-[10px] font-black uppercase rounded-full border border-white/10 cursor-pointer hover:bg-white/10">
                  Seleccionar desde Galería
                </label>
              </div>

              <div className="space-y-4">
                {formData.media.length > 0 && (
                  <div className="grid grid-cols-4 gap-3">
                    {formData.media.map((m, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-white/5">
                        {m.type === 'video' ? <div className="w-full h-full bg-slate-900 flex items-center justify-center text-[8px] font-bold">VIDEO</div> : <img src={m.url} className="w-full h-full object-cover opacity-60" />}
                        <button type="button" onClick={() => removeExistingMedia(idx)} className="absolute inset-0 bg-red-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-black">QUITAR</button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-4 gap-3">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-[#fbbf24]/50">
                      <img src={file.preview} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeFile(idx)} className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">X</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button disabled={loading} className="flex-1 py-6 bg-[#fbbf24] text-black rounded-3xl font-black uppercase text-xs hover:scale-[1.02] transition-transform disabled:opacity-50">
                    {loading ? uploadProgress : (editingId ? 'Guardar Cambios' : 'Publicar Ahora')}
                </button>
                {editingId && (
                    <button type="button" onClick={resetForm} className="px-6 py-6 border border-white/10 rounded-3xl font-black text-[10px] uppercase">Cancelar</button>
                )}
              </div>
            </form>
          </div>

          <div className="lg:col-span-7 space-y-4 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
            {projects.length === 0 ? (
               <div className="text-center py-20 text-white/20 uppercase font-black">No hay proyectos</div>
            ) : (
              projects.map(p => (
                <div key={p.id} className="bg-[#111] p-6 rounded-[2.5rem] border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-6">
                    <img src={p.url} className="w-20 h-20 rounded-2xl object-cover" alt="obra" />
                    <div>
                      <h4 className="font-black uppercase text-lg leading-tight">{p.title}</h4>
                      <p className="text-[#fbbf24] text-[9px] font-black uppercase tracking-widest">{p.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(p)} className="w-12 h-12 rounded-full border border-[#fbbf24]/30 flex items-center justify-center text-[#fbbf24] hover:bg-[#fbbf24] hover:text-black transition-all">
                      <span className="text-[10px] font-black">EDIT</span>
                    </button>
                    <button onClick={() => { if(confirm('¿Borrar obra?')) deleteProject(p.id).then(loadData) }} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/20 hover:bg-red-500 hover:text-white transition-all">
                      <Icons.Trash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
