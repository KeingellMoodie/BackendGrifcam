// controllers/category.controller.js
const CategoryModel = require('../models/category.model');

const CategoryController = {

  // GET /api/categories
  async getAll(req, res) {
    try {
      const categories = await CategoryModel.findAll();
      res.json(categories);
    } catch (error) {
      console.error('Error en category.getAll:', error.message);
      res.status(500).json({ error: 'Error al obtener las categorías.' });
    }
  },

  // GET /api/categories/:id
  async getById(req, res) {
    try {
      const category = await CategoryModel.findById(req.params.id);
      if (!category) return res.status(404).json({ error: 'Categoría no encontrada.' });
      res.json(category);
    } catch (error) {
      console.error('Error en category.getById:', error.message);
      res.status(500).json({ error: 'Error al obtener la categoría.' });
    }
  },

  // POST /api/categories  ← requiere JWT
  async create(req, res) {
    try {
      const { name } = req.body;
      if (!name || !name.trim()) {
        return res.status(400).json({ error: 'El nombre de la categoría es requerido.' });
      }
      const category = await CategoryModel.create({ name: name.trim() });
      res.status(201).json({ message: 'Categoría creada exitosamente.', category });
    } catch (error) {
      console.error('Error en category.create:', error.message);
      res.status(500).json({ error: 'Error al crear la categoría.' });
    }
  },

  // PUT /api/categories/:id  ← requiere JWT
  async update(req, res) {
    try {
      const { name } = req.body;
      if (!name || !name.trim()) {
        return res.status(400).json({ error: 'El nombre de la categoría es requerido.' });
      }
      const category = await CategoryModel.update(req.params.id, { name: name.trim() });
      if (!category) return res.status(404).json({ error: 'Categoría no encontrada.' });
      res.json({ message: 'Categoría actualizada exitosamente.', category });
    } catch (error) {
      console.error('Error en category.update:', error.message);
      res.status(500).json({ error: 'Error al actualizar la categoría.' });
    }
  },

  // DELETE /api/categories/:id  ← requiere JWT
  async delete(req, res) {
    try {
      const deleted = await CategoryModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Categoría no encontrada.' });
      res.json({ message: 'Categoría eliminada exitosamente.' });
    } catch (error) {
      console.error('Error en category.delete:', error.message);
      res.status(500).json({ error: 'Error al eliminar la categoría.' });
    }
  }
};

module.exports = CategoryController;
