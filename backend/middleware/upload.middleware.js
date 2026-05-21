// ─────────────────────────────────────────────────────────────
// Archivo: middleware/upload.middleware.js
// ¿Qué cambió?
//   Antes usábamos upload.single('image') — aceptaba UNA imagen.
//   Ahora usamos upload.array('images', 3) — acepta hasta 3.
//   En Thunder Client o el frontend se envían los archivos con
//   el campo llamado "images" (plural) en el Form Data.
// ─────────────────────────────────────────────────────────────

const multer   = require('multer');
const path     = require('path');
const supabase = require('../config/db');

// memoryStorage: guarda el archivo en RAM temporalmente
// en vez de escribirlo en disco (/uploads)
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const isValid = allowed.test(path.extname(file.originalname).toLowerCase())
               && allowed.test(file.mimetype);
  if (isValid) cb(null, true);
  else cb(new Error('Solo se permiten imágenes (jpg, png, webp, gif)'));
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB por imagen
});

// Sube UN archivo a Supabase Storage y devuelve su URL pública.
// Se llama desde el controlador para cada imagen en req.files.
async function uploadToSupabase(file) {
  const fileName = `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`;

  const { error } = await supabase.storage
    .from('product-images')        // nombre del bucket en Supabase
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

  if (error) throw error;

  // Devuelve la URL pública permanente de la imagen
  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName);

  return data.publicUrl;
}

module.exports = { upload, uploadToSupabase };
