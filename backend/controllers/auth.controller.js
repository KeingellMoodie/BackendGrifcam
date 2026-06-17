// ─────────────────────────────────────────────────────────────
// Archivo: controllers/auth.controller.js
// ¿Qué hace?
//   Maneja la lógica del login del administrador.
//   Recibe los datos del request, llama al modelo, y responde.
//
//   Flujo del login:
//   1. Frontend envía POST /api/auth/login con {username, password}
//   2. Este controlador busca el usuario en la BD
//   3. Verifica la contraseña con bcrypt
//   4. Si todo OK → genera un JWT y lo devuelve al frontend
//   5. El frontend guarda el JWT y lo usa en peticiones futuras
// ─────────────────────────────────────────────────────────────

const jwt      = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const bcrypt = require('bcryptjs');

const AuthController = {

  // POST /api/auth/login
  async login(req, res) {
    try {

      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          error: 'Usuario y contraseña son requeridos.'
        });
      }

      // Buscamos el usuario en la BD
      const user = await UserModel.findByUsername(username);

      if (!user) {
        // No revelamos si falló usuario o contraseña
        return res.status(401).json({
          error: 'Credenciales incorrectas.'
        });
      }

      // Verificamos la contraseña
      const isValid = await UserModel.verifyPassword(
        password,
        user.password_hash
      );

      if (!isValid) {
        return res.status(401).json({
          error: 'Credenciales incorrectas.'
        });
      }

      // Generamos el JWT
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      // Respondemos
      res.json({
        message: 'Login exitoso',
        token,
        user: {
          id: user.id,
          username: user.username
        }
      });

    } catch (error) {

      console.error('Error en login:', error);

      res.status(500).json({
        error: 'Error interno del servidor.'
      });
    }
  },

  async verifyRecoveryCode(req, res) {
    try {
      const { recovery_code } = req.body;
  
      console.log('Código recibido:', recovery_code);
  
      const record = await UserModel.getRecoveryCode();
  
      console.log('Registro en BD:', record);
  
      const isValid = await bcrypt.compare(recovery_code, record.code);
  
      console.log('¿Coincide?:', isValid);
  
      if (!isValid) {
        return res.status(401).json({ error: 'Código incorrecto.' });
      }
  
      console.log('ANTES DEL RESPONSE');
  
      return res.status(200).json({
        ok: true
      });
  
    } catch (error) {
      console.error('ERROR COMPLETO:', error);
      return res.status(500).json({ error: 'Error al verificar el código.' });
    }
  },

  // POST /api/auth/reset-password
  // Verifica el código Y actualiza la contraseña
  async resetPassword(req, res) {
    try {
      const { recovery_code, new_password } = req.body;
      if (!recovery_code || !new_password) {
        return res.status(400).json({ error: 'Código y nueva contraseña son requeridos.' });
      }

      // 1. Verificar el código
      const record = await UserModel.getRecoveryCode();
      if (!record) {
        return res.status(404).json({ error: 'No hay código de recuperación configurado.' });
      }

      const isValid = await bcrypt.compare(recovery_code, record.code);
      if (!isValid) {
        return res.status(401).json({ error: 'Código de recuperación incorrecto.' });
      }

      // 2. Hashear la nueva contraseña y actualizar
      const newHash = await bcrypt.hash(new_password, 10);
      await UserModel.updateAllPasswords(newHash);

      res.json({ message: 'Contraseña actualizada correctamente.' });
    } catch (error) {
      console.error('Error en resetPassword:', error.message);
      res.status(500).json({ error: 'Error al restablecer la contraseña.' });
    }
  },

  // POST /api/auth/seed
  async seed(req, res) {
    try {

      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          error: 'Campos requeridos.'
        });
      }

      const newUser = await UserModel.createAdmin(
        username,
        password
      );

      res.status(201).json({
        message: 'Admin creado',
        user: newUser
      });

    } catch (error) {

      console.error('Error en seed:', error);

      res.status(500).json({
        error: 'Error interno del servidor.'
      });
    }
  }
};

module.exports = AuthController;
