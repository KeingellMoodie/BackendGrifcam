jest.mock('../models/politicas.model', () => ({
  getAll: jest.fn(),
  update: jest.fn()
}));

const PoliticasController = require('../controllers/politicas.controller');
const PoliticasModel = require('../models/politicas.model');

describe('PoliticasController.getAll', () => {

  test('devuelve las políticas correctamente', async () => {
    const politicas = [
      { id: 1, titulo: 'Política 1', contenido: 'Contenido 1' }
    ];

    PoliticasModel.getAll.mockResolvedValue(politicas);

    const req = {};
    const res = {
      json: jest.fn()
    };

    await PoliticasController.getAll(req, res);

    expect(PoliticasModel.getAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(politicas);
  });

  test('devuelve 500 si ocurre un error', async () => {
    PoliticasModel.getAll.mockRejectedValue(new Error('Error BD'));

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await PoliticasController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error al obtener las políticas.'
    });
  });

});

describe('PoliticasController.update', () => {

  test('actualiza una política correctamente', async () => {
    const politicaActualizada = {
      id: 1,
      titulo: 'Nuevo título',
      contenido: 'Nuevo contenido'
    };

    PoliticasModel.update.mockResolvedValue(politicaActualizada);

    const req = {
      params: { id: 1 },
      body: {
        titulo: 'Nuevo título',
        contenido: 'Nuevo contenido'
      }
    };

    const res = {
      json: jest.fn()
    };

    await PoliticasController.update(req, res);

    expect(PoliticasModel.update).toHaveBeenCalledWith(
      1,
      {
        titulo: 'Nuevo título',
        contenido: 'Nuevo contenido'
      }
    );

    expect(res.json).toHaveBeenCalledWith({
      message: 'Política actualizada correctamente.',
      data: politicaActualizada
    });
  });

  test('devuelve 400 si falta título', async () => {
    const req = {
      params: { id: 1 },
      body: {
        contenido: 'Contenido'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await PoliticasController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Título y contenido son requeridos.'
    });
  });

  test('devuelve 400 si falta contenido', async () => {
    const req = {
      params: { id: 1 },
      body: {
        titulo: 'Título'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await PoliticasController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Título y contenido son requeridos.'
    });
  });

  test('devuelve 500 si ocurre un error al actualizar', async () => {
    PoliticasModel.update.mockRejectedValue(new Error('Error BD'));

    const req = {
      params: { id: 1 },
      body: {
        titulo: 'Título',
        contenido: 'Contenido'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await PoliticasController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error al actualizar la política.'
    });
  });

});