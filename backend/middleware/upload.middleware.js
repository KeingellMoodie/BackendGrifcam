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

function videoFilter(req, file, cb) {
  const extOk  = /mp4|webm|mov|avi/.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = /video\//.test(file.mimetype);
  if (extOk && mimeOk) cb(null, true);
  else cb(new Error('Solo se permiten videos (mp4, webm, mov, avi)'));
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB por imagen
});

const uploadVideo = multer({ storage, fileFilter: videoFilter,
  limits: { fileSize: 100 * 1024 * 1024 } });

// Sube UN archivo a Supabase Storage y devuelve su URL pública.
// Se llama desde el controlador para cada imagen en req.files.
async function uploadFileToSupabase(file, bucket) {
  const fileName = `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`;
  const { error } = await supabase.storage
    .from(bucket).upload(fileName, file.buffer, { contentType: file.mimetype, upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}

async function deleteFileFromSupabase(publicUrl, bucket) {
  const fileName = publicUrl.split(`/${bucket}/`)[1];
  if (!fileName) return;
  const { error } = await supabase.storage.from(bucket).remove([fileName]);
  if (error) console.error('Error borrando de Storage:', error.message);
}

async function uploadToSupabase(file) {
  return uploadFileToSupabase(file, 'product-images');
}

module.exports = { upload, uploadVideo, uploadToSupabase, uploadFileToSupabase, deleteFileFromSupabase };
