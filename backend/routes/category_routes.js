// routes/category.routes.js
const express            = require('express');
const CategoryController = require('../controllers/category.controller');
const { verifyToken }    = require('../middleware/auth.middleware');

const router = express.Router();

// Públicas
router.get('/',    CategoryController.getAll);
router.get('/:id', CategoryController.getById);

// Protegidas — requieren JWT
router.post('/',      verifyToken, CategoryController.create);
router.put('/:id',    verifyToken, CategoryController.update);
router.delete('/:id', verifyToken, CategoryController.delete);

module.exports = router;
