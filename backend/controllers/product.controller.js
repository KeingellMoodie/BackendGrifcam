// ─────────────────────────────────────────────────────────────
// Archivo: controllers/product.controller.js  (versión 2)
// ¿Qué cambió?
//   1. create() y update() ahora leen req.files (array) en vez
//      de req.file (un solo archivo).
//   2. Se maneja previous_price: si el producto está en oferta
//      y se envía previous_price, se guarda; si no, se deja null.
//   3. Los IDs siguen siendo UUID string (sin Number()).
// ─────────────────────────────────────────────────────────────

const ProductModel = require('../models/product.model');
const { uploadToSupabase }  = require('../middleware/upload.middleware');



  // GET /api/products
  // Query params opcionales:
  //   ?category=uuid     → filtra por categoría
  //   ?filter=is_offer   → solo ofertas
  //   ?filter=is_new     → solo novedades
const ProductController = {

  // GET /api/products
  async getAll(req, res) {
    try {
      const { category, filter } = req.query;
      let products;

      if (category) {
        products = await ProductModel.findByCategory(category);
      } else if (filter === 'is_offer' || filter === 'is_new') {
        products = await ProductModel.findByFlag(filter);
      } else {
        products = await ProductModel.findAll();
      }

      res.json(products);
    } catch (error) {
      console.error('Error al obtener productos:', error.message);
      res.status(500).json({ error: 'Error al obtener los productos.' });
    }
  },

  // GET /api/products/:id
  async getById(req, res) {
    try {
      const product = await ProductModel.findById(req.params.id);

      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado.' });
      }

      res.json(product);
    } catch (error) {
      console.error('Error al obtener producto:', error.message);
      res.status(500).json({ error: 'Error al obtener el producto.' });
    }
  },

  // POST /api/products  ← Requiere JWT
  async create(req, res) {
    try {
      console.log('Archivos recibidos:', req.files); 
      console.log('Body recibido:', req.body);
      console.log('Fieldnames:', (req.files || []).map(f => f.fieldname));
      const { name, description, price, previous_price,
              category_id, is_offer, is_new } = req.body;

      if (!name || !price || !category_id) {
        return res.status(400).json({ error: 'Nombre, precio y categoría son requeridos.' });
      }

      // Subir cada imagen a Supabase Storage y obtener su URL pública
      const imageUrls = await Promise.all(
        (req.files || []).map(file => uploadToSupabase(file))
      );

      const product = await ProductModel.create({
        name,
        description,
        price:          Number(price),
        previous_price: previous_price ? Number(previous_price) : null,
        category_id,
        is_offer:  is_offer === 'true' || is_offer === true,
        is_new:    is_new   === 'true' || is_new   === true,
        imageUrls
      });

      res.status(201).json({ message: 'Producto creado exitosamente.', product });
    } catch (error) {
      console.error('Error al crear producto:', error.message);
      res.status(500).json({ error: 'Error al crear el producto.' });
    }
  },

  // PUT /api/products/:id  ← Requiere JWT
  async update(req, res) {
    try {
      const { name, description, price, previous_price,
              category_id, is_offer, is_new } = req.body;

      if (!name || !price || !category_id) {
        return res.status(400).json({ error: 'Nombre, precio y categoría son requeridos.' });
      }

      // Si se enviaron imágenes nuevas las subimos a Supabase
      // Si no se enviaron, el modelo mantiene las anteriores
      const imageUrls = await Promise.all(
        (req.files || []).map(file => uploadToSupabase(file))
      );

      const product = await ProductModel.update(req.params.id, {
        name,
        description,
        price:          Number(price),
        previous_price: previous_price ? Number(previous_price) : null,
        category_id,
        is_offer:  is_offer === 'true' || is_offer === true,
        is_new:    is_new   === 'true' || is_new   === true,
        imageUrls
      });

      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado.' });
      }

      res.json({ message: 'Producto actualizado exitosamente.', product });
    } catch (error) {
      console.error('Error al actualizar producto:', error.message);
      res.status(500).json({ error: 'Error al actualizar el producto.' });
    }
  },

  // DELETE /api/products/:id  ← Requiere JWT
  async delete(req, res) {
    try {
      const deleted = await ProductModel.delete(req.params.id);

      if (!deleted) {
        return res.status(404).json({ error: 'Producto no encontrado.' });
      }

      res.json({ message: 'Producto eliminado exitosamente.' });
    } catch (error) {
      console.error('Error al eliminar producto:', error.message);
      res.status(500).json({ error: 'Error al eliminar el producto.' });
    }
  }
};

module.exports = ProductController;
