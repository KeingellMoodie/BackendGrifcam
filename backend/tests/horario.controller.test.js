// tests/horario.controller.test.js

jest.mock('../models/horario.model', () => ({
  getAll: jest.fn(),
  update: jest.fn()
}));

const HorarioController = require('../controllers/horario.controller');
const HorarioModel = require('../models/horario.model');

describe('HorarioController.getAll', () => {

  let req, res;

  beforeEach(() => {
    req = {};

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  test('devuelve el horario correctamente', async () => {

    const horario = [
      {
        id: 1,
        horas: '8:00 AM - 5:00 PM',
        abierto: true
      }
    ];

    HorarioModel.getAll.mockResolvedValue(horario);

    await HorarioController.getAll(req, res);

    expect(HorarioModel.getAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(horario);
  });

  test('retorna 500 si ocurre un error', async () => {

    HorarioModel.getAll.mockRejectedValue(
      new Error('DB Error')
    );

    await HorarioController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error al obtener el horario.'
    });
  });

});

describe('HorarioController.update', () => {

  let req, res;

  beforeEach(() => {

    req = {
      params: {},
      body: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  test('retorna 400 si no se envían campos', async () => {

    req.params.id = '1';
    req.body = {};

    await HorarioController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Se requiere al menos horas o abierto.'
    });
  });

  test('actualiza correctamente usando horas', async () => {

    req.params.id = '1';
    req.body = {
      horas: '9:00 AM - 6:00 PM'
    };

    const updated = {
      id: '1',
      horas: '9:00 AM - 6:00 PM',
      abierto: true
    };

    HorarioModel.update.mockResolvedValue(updated);

    await HorarioController.update(req, res);

    expect(HorarioModel.update)
      .toHaveBeenCalledWith('1', {
        horas: '9:00 AM - 6:00 PM',
        abierto: undefined
      });

    expect(res.json).toHaveBeenCalledWith({
      message: 'Horario actualizado correctamente.',
      data: updated
    });
  });

  test('actualiza correctamente usando abierto', async () => {

    req.params.id = '1';
    req.body = {
      abierto: false
    };

    const updated = {
      id: '1',
      horas: '8:00 AM - 5:00 PM',
      abierto: false
    };

    HorarioModel.update.mockResolvedValue(updated);

    await HorarioController.update(req, res);

    expect(HorarioModel.update)
      .toHaveBeenCalledWith('1', {
        horas: undefined,
        abierto: false
      });

    expect(res.json).toHaveBeenCalled();
  });

  test('retorna 500 si ocurre un error', async () => {

    req.params.id = '1';
    req.body = {
      horas: '10:00 AM - 7:00 PM'
    };

    HorarioModel.update.mockRejectedValue(
      new Error('DB Error')
    );

    await HorarioController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error al actualizar el horario.'
    });
  });

});