// ─────────────────────────────────────────────────────────────
// Archivo: routes/business.routes.js
// GET  /api/business        → público
// PUT  /api/business/:id    → privado (requiere JWT)
// ─────────────────────────────────────────────────────────────
const express             = require('express');
const BusinessController  = require('../controllers/business.controller');
const { verifyToken }     = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/',       BusinessController.get);
router.put('/:id',    verifyToken, BusinessController.update);

module.exports = router;
