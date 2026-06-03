// ─────────────────────────────────────────────────────────────
// Archivo: controllers/politicas.controller.js
// Endpoints:
//   GET /api/politicas        → público
//   PUT /api/politicas/:id    → privado, edita una política
// ─────────────────────────────────────────────────────────────
const PoliticasModel = require('../models/politicas.model');

const PoliticasController = {

  async getAll(req, res) {
    try {
      const data = await PoliticasModel.getAll();
      res.json(data);
    } catch (error) {
      console.error('Error en politicas.getAll:', error.message);
      res.status(500).json({ error: 'Error al obtener las políticas.' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { titulo, contenido } = req.body;

      if (!titulo || !contenido) {
        return res.status(400).json({ error: 'Título y contenido son requeridos.' });
      }

      const data = await PoliticasModel.update(id, { titulo, contenido });
      res.json({ message: 'Política actualizada correctamente.', data });
    } catch (error) {
      console.error('Error en politicas.update:', error.message);
      res.status(500).json({ error: 'Error al actualizar la política.' });
    }
  }
};

module.exports = PoliticasController;
