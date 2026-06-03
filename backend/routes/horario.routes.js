// ─────────────────────────────────────────────────────────────
// Archivo: routes/horario.routes.js
// GET /api/horario        → público
// PUT /api/horario/:id   → privado (requiere JWT)
// ─────────────────────────────────────────────────────────────
const express            = require('express');
const HorarioController  = require('../controllers/horario.controller');
const { verifyToken }    = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/',      HorarioController.getAll);
router.put('/:id',   verifyToken, HorarioController.update);

module.exports = router;
