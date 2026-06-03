// ─────────────────────────────────────────────────────────────
// Archivo: routes/politicas.routes.js
// GET /api/politicas        → público
// PUT /api/politicas/:id    → privado (requiere JWT)
// ─────────────────────────────────────────────────────────────
const express              = require('express');
const PoliticasController  = require('../controllers/politicas.controller');
const { verifyToken }      = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/',      PoliticasController.getAll);
router.put('/:id',   verifyToken, PoliticasController.update);

module.exports = router;
