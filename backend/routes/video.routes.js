// ─────────────────────────────────────────────────────────────
// Archivo: routes/video.routes.js
// GET    /api/videos        → público
// POST   /api/videos        → privado (sube un video)
// PUT    /api/videos/:id    → privado (edita título/orden)
// DELETE /api/videos/:id    → privado (borra de BD y Storage)
//
// El campo del archivo en el form-data debe llamarse "video"
// ─────────────────────────────────────────────────────────────
const express           = require('express');
const VideoController   = require('../controllers/video.controller');
const { verifyToken }   = require('../middleware/auth.middleware');
const { uploadVideo }   = require('../middleware/upload.middleware');

const router = express.Router();

router.get('/',       VideoController.getAll);
router.post('/',      verifyToken, uploadVideo.single('video'), VideoController.create);
router.put('/:id',    verifyToken, VideoController.update);
router.delete('/:id', verifyToken, VideoController.delete);

module.exports = router;
