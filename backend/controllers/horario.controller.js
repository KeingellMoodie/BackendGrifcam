// ─────────────────────────────────────────────────────────────
// Archivo: controllers/horario.controller.js
// Endpoints:
//   GET /api/horario          → público
//   PUT /api/horario/:id      → privado, edita un día
// ─────────────────────────────────────────────────────────────
const HorarioModel = require('../models/horario.model');

const HorarioController = {

  async getAll(req, res) {
    try {
      const data = await HorarioModel.getAll();
      res.json(data);
    } catch (error) {
      console.error('Error en horario.getAll:', error.message);
      res.status(500).json({ error: 'Error al obtener el horario.' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { horas, abierto } = req.body;

      if (!horas && abierto === undefined) {
        return res.status(400).json({ error: 'Se requiere al menos horas o abierto.' });
      }

      const data = await HorarioModel.update(id, { horas, abierto });
      res.json({ message: 'Horario actualizado correctamente.', data });
    } catch (error) {
      console.error('Error en horario.update:', error.message);
      res.status(500).json({ error: 'Error al actualizar el horario.' });
    }
  }
};

module.exports = HorarioController;
