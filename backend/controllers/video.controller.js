// ─────────────────────────────────────────────────────────────
// Archivo: controllers/video.controller.js
// ¿Cómo funciona la subida de videos?
//   Igual que las imágenes: Multer los recibe en memoria
//   y uploadToSupabase() los sube al bucket "videos" de Supabase.
//   La URL pública resultante se guarda en la tabla videos.
//
// Endpoints:
//   GET    /api/videos         → público
//   POST   /api/videos         → privado (sube video + guarda en BD)
//   PUT    /api/videos/:id     → privado (edita título/orden)
//   DELETE /api/videos/:id     → privado (borra de BD y de Storage)
// ─────────────────────────────────────────────────────────────
const VideoModel                 = require('../models/video.model');
const { uploadFileToSupabase, deleteFileFromSupabase } = require('../middleware/upload.middleware');

const VideoController = {

  async getAll(req, res) {
    try {
      const data = await VideoModel.getAll();
      res.json(data);
    } catch (error) {
      console.error('Error en video.getAll:', error.message);
      res.status(500).json({ error: 'Error al obtener los videos.' });
    }
  },

  async create(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Se requiere un archivo de video.' });
      }

      const { titulo, orden } = req.body;

      // Sube el video a Supabase Storage en el bucket "videos"
      const url = await uploadFileToSupabase(req.file, 'videos');

      const video = await VideoModel.create({
        titulo: titulo || '',
        url,
        orden: orden ? Number(orden) : 0
      });

      res.status(201).json({ message: 'Video subido exitosamente.', video });
    } catch (error) {
      console.error('Error en video.create:', error.message);
      res.status(500).json({ error: 'Error al subir el video.' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { titulo, orden } = req.body;

      const video = await VideoModel.update(id, {
        titulo,
        orden: orden ? Number(orden) : 0
      });

      res.json({ message: 'Video actualizado correctamente.', video });
    } catch (error) {
      console.error('Error en video.update:', error.message);
      res.status(500).json({ error: 'Error al actualizar el video.' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      // Primero obtenemos la URL para borrar de Storage también
      const deleted = await VideoModel.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Video no encontrado.' });
      }

      // Borramos el archivo de Supabase Storage
      if (deleted.url) {
        await deleteFileFromSupabase(deleted.url, 'videos');
      }

      res.json({ message: 'Video eliminado correctamente.' });
    } catch (error) {
      console.error('Error en video.delete:', error.message);
      res.status(500).json({ error: 'Error al eliminar el video.' });
    }
  }
};

module.exports = VideoController;
