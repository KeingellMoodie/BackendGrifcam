jest.mock('../models/video.model', () => ({
  getAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
}));

jest.mock('../middleware/upload.middleware', () => ({
  uploadFileToSupabase: jest.fn(),
  deleteFileFromSupabase: jest.fn()
}));

const VideoController = require('../controllers/video.controller');
const VideoModel = require('../models/video.model');
const {
  uploadFileToSupabase,
  deleteFileFromSupabase
} = require('../middleware/upload.middleware');

describe('VideoController.getAll', () => {

  test('devuelve videos correctamente', async () => {
    const videos = [{ id: 1, titulo: 'Video 1' }];

    VideoModel.getAll.mockResolvedValue(videos);

    const req = {};
    const res = { json: jest.fn() };

    await VideoController.getAll(req, res);

    expect(res.json).toHaveBeenCalledWith(videos);
  });

  test('devuelve 500 si ocurre error', async () => {
    VideoModel.getAll.mockRejectedValue(new Error('Error'));

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await VideoController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error al obtener los videos.'
    });
  });

});

describe('VideoController.create', () => {

  test('devuelve 400 si no se envía archivo', async () => {
    const req = {
      file: null,
      body: {}
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await VideoController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Se requiere un archivo de video.'
    });
  });

  test('crea video correctamente', async () => {

    const videoCreado = {
      id: 1,
      titulo: 'Demo',
      url: 'https://video.mp4',
      orden: 1
    };

    uploadFileToSupabase.mockResolvedValue('https://video.mp4');
    VideoModel.create.mockResolvedValue(videoCreado);

    const req = {
      file: { originalname: 'video.mp4' },
      body: {
        titulo: 'Demo',
        orden: '1'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await VideoController.create(req, res);

    expect(uploadFileToSupabase)
      .toHaveBeenCalledWith(req.file, 'videos');

    expect(VideoModel.create).toHaveBeenCalledWith({
      titulo: 'Demo',
      url: 'https://video.mp4',
      orden: 1
    });

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('devuelve 500 si ocurre error', async () => {

    uploadFileToSupabase.mockRejectedValue(new Error('Error'));

    const req = {
      file: { originalname: 'video.mp4' },
      body: {}
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await VideoController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error al subir el video.'
    });
  });

});

describe('VideoController.update', () => {

  test('actualiza video correctamente', async () => {

    const video = {
      id: 1,
      titulo: 'Nuevo'
    };

    VideoModel.update.mockResolvedValue(video);

    const req = {
      params: { id: 1 },
      body: {
        titulo: 'Nuevo',
        orden: '2'
      }
    };

    const res = {
      json: jest.fn()
    };

    await VideoController.update(req, res);

    expect(VideoModel.update).toHaveBeenCalledWith(
      1,
      {
        titulo: 'Nuevo',
        orden: 2
      }
    );

    expect(res.json).toHaveBeenCalledWith({
      message: 'Video actualizado correctamente.',
      video
    });
  });

  test('devuelve 500 si ocurre error', async () => {

    VideoModel.update.mockRejectedValue(new Error('Error'));

    const req = {
      params: { id: 1 },
      body: {}
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await VideoController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error al actualizar el video.'
    });
  });

});

describe('VideoController.delete', () => {

  test('elimina video correctamente', async () => {

    VideoModel.delete.mockResolvedValue({
      id: 1,
      url: 'https://video.mp4'
    });

    const req = {
      params: { id: 1 }
    };

    const res = {
      json: jest.fn()
    };

    await VideoController.delete(req, res);

    expect(deleteFileFromSupabase)
      .toHaveBeenCalledWith(
        'https://video.mp4',
        'videos'
      );

    expect(res.json).toHaveBeenCalledWith({
      message: 'Video eliminado correctamente.'
    });
  });

  test('devuelve 404 si no existe', async () => {

    VideoModel.delete.mockResolvedValue(null);

    const req = {
      params: { id: 1 }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await VideoController.delete(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Video no encontrado.'
    });
  });

  test('devuelve 500 si ocurre error', async () => {

    VideoModel.delete.mockRejectedValue(new Error('Error'));

    const req = {
      params: { id: 1 }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await VideoController.delete(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error al eliminar el video.'
    });
  });

});