// ─────────────────────────────────────────────────────────────
// Archivo: controllers/business.controller.js
// Endpoints:
//   GET  /api/business        → público, devuelve info del negocio
//   PUT  /api/business/:id    → privado, actualiza info del negocio
// ─────────────────────────────────────────────────────────────
const BusinessModel = require('../models/business.model');

const BusinessController = {

  async get(req, res) {
    try {
      const data = await BusinessModel.get();
      if (!data) return res.status(404).json({ error: 'Información del negocio no encontrada.' });
      res.json(data);
    } catch (error) {
      console.error('Error en business.get:', error.message);
      res.status(500).json({ error: 'Error al obtener la información del negocio.' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      // Campos permitidos — evita que el front modifique campos internos
      const {
        descripcion_corta, descripcion_larga,
        telefono, whatsapp, email, ubicacion,
        maps_link, maps_embed, instagram, facebook
      } = req.body;

      const data = await BusinessModel.update(id, {
        descripcion_corta, descripcion_larga,
        telefono, whatsapp, email, ubicacion,
        maps_link, maps_embed, instagram, facebook
      });
      res.json({ message: 'Información actualizada correctamente.', data });
    } catch (error) {
      console.error('Error en business.update:', error.message);
      res.status(500).json({ error: 'Error al actualizar la información del negocio.' });
    }
  }
};

module.exports = BusinessController;
