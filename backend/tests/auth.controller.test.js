require('dotenv').config();

const AuthController = require('../controllers/auth.controller');
const UserModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


jest.mock('../models/user.model');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('AuthController.login', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('400 si faltan credenciales', async () => {
    const req = { body: {} };
    const res = mockResponse();

    await AuthController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('401 si usuario no existe', async () => {
    UserModel.findByUsername.mockResolvedValue(null);

    const req = {
      body: {
        username: 'admin',
        password: '1234'
      }
    };

    const res = mockResponse();

    await AuthController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('401 si contraseña incorrecta', async () => {
    UserModel.findByUsername.mockResolvedValue({
      id: 1,
      username: 'admin',
      password_hash: 'hash'
    });

    UserModel.verifyPassword.mockResolvedValue(false);

    const req = {
      body: {
        username: 'admin',
        password: '1234'
      }
    };

    const res = mockResponse();

    await AuthController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('login exitoso', async () => {
    UserModel.findByUsername.mockResolvedValue({
      id: 1,
      username: 'admin',
      password_hash: 'hash'
    });

    UserModel.verifyPassword.mockResolvedValue(true);

    jwt.sign.mockReturnValue('fake-token');

    const req = {
      body: {
        username: 'admin',
        password: '1234'
      }
    };

    const res = mockResponse();

    await AuthController.login(req, res);

    expect(jwt.sign).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        token: 'fake-token'
      })
    );
  });

  test('500 si ocurre excepción', async () => {
    UserModel.findByUsername.mockRejectedValue(
      new Error('DB Error')
    );

    const req = {
      body: {
        username: 'admin',
        password: '1234'
      }
    };

    const res = mockResponse();

    await AuthController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('AuthController.verifyRecoveryCode', () => {

  test('400 si no envía código', async () => {
    const req = { body: {} };
    const res = mockResponse();

    await AuthController.verifyRecoveryCode(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('404 si no existe código guardado', async () => {
    UserModel.getRecoveryCode.mockResolvedValue(null);

    const req = {
      body: {
        recovery_code: 'ABC'
      }
    };

    const res = mockResponse();

    await AuthController.verifyRecoveryCode(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('401 si código incorrecto', async () => {
    UserModel.getRecoveryCode.mockResolvedValue({
      code: 'hash'
    });

    bcrypt.compare.mockResolvedValue(false);

    const req = {
      body: {
        recovery_code: 'ABC'
      }
    };

    const res = mockResponse();

    await AuthController.verifyRecoveryCode(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('verificación exitosa', async () => {
    UserModel.getRecoveryCode.mockResolvedValue({
      code: 'hash'
    });

    bcrypt.compare.mockResolvedValue(true);

    const req = {
      body: {
        recovery_code: 'ABC'
      }
    };

    const res = mockResponse();

    await AuthController.verifyRecoveryCode(req, res);

    expect(res.json).toHaveBeenCalled();
  });
});

describe('AuthController.resetPassword', () => {

  test('400 si faltan datos', async () => {
    const req = { body: {} };
    const res = mockResponse();

    await AuthController.resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('404 si no existe código de recuperación', async () => {
    UserModel.getRecoveryCode.mockResolvedValue(null);

    const req = {
      body: {
        recovery_code: 'ABC',
        new_password: '123456'
      }
    };

    const res = mockResponse();

    await AuthController.resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('401 si código incorrecto', async () => {
    UserModel.getRecoveryCode.mockResolvedValue({
      code: 'hash'
    });

    bcrypt.compare.mockResolvedValue(false);

    const req = {
      body: {
        recovery_code: 'ABC',
        new_password: '123456'
      }
    };

    const res = mockResponse();

    await AuthController.resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('restablece contraseña correctamente', async () => {
    UserModel.getRecoveryCode.mockResolvedValue({
      code: 'hash'
    });

    bcrypt.compare.mockResolvedValue(true);
    bcrypt.hash.mockResolvedValue('newHash');

    UserModel.updateAllPasswords.mockResolvedValue();

    const req = {
      body: {
        recovery_code: 'ABC',
        new_password: '123456'
      }
    };

    const res = mockResponse();

    await AuthController.resetPassword(req, res);

    expect(UserModel.updateAllPasswords)
      .toHaveBeenCalledWith('newHash');

    expect(res.json).toHaveBeenCalled();
  });
});

describe('AuthController.seed', () => {

  test('400 si faltan campos', async () => {
    const req = { body: {} };
    const res = mockResponse();

    await AuthController.seed(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('crea admin correctamente', async () => {
    UserModel.createAdmin.mockResolvedValue({
      id: 1,
      username: 'admin'
    });

    const req = {
      body: {
        username: 'admin',
        password: '1234'
      }
    };

    const res = mockResponse();

    await AuthController.seed(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('500 si ocurre excepción', async () => {
    UserModel.createAdmin.mockRejectedValue(
      new Error('DB Error')
    );

    const req = {
      body: {
        username: 'admin',
        password: '1234'
      }
    };

    const res = mockResponse();

    await AuthController.seed(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});