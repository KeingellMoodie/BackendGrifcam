jest.mock('../config/db', () => ({
  storage: {
    from: jest.fn()
  }
}));

const supabase = require('../config/db');

const {
  uploadFileToSupabase,
  deleteFileFromSupabase
} = require('../middleware/upload.middleware');

describe('uploadFileToSupabase', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('sube archivo y devuelve URL pública', async () => {

    const uploadMock = jest.fn().mockResolvedValue({
      error: null
    });

    const getPublicUrlMock = jest.fn().mockReturnValue({
      data: {
        publicUrl: 'https://test.com/image.jpg'
      }
    });

    supabase.storage.from.mockReturnValue({
      upload: uploadMock,
      getPublicUrl: getPublicUrlMock
    });

    const file = {
      originalname: 'imagen.jpg',
      buffer: Buffer.from('fake'),
      mimetype: 'image/jpeg'
    };

    const url = await uploadFileToSupabase(
      file,
      'product-images'
    );

    expect(uploadMock).toHaveBeenCalled();
    expect(getPublicUrlMock).toHaveBeenCalled();
    expect(url).toBe('https://test.com/image.jpg');
  });

  test('lanza error si falla upload', async () => {

    const uploadMock = jest.fn().mockResolvedValue({
      error: new Error('Error de upload')
    });

    supabase.storage.from.mockReturnValue({
      upload: uploadMock
    });

    const file = {
      originalname: 'imagen.jpg',
      buffer: Buffer.from('fake'),
      mimetype: 'image/jpeg'
    };

    await expect(
      uploadFileToSupabase(file, 'product-images')
    ).rejects.toThrow('Error de upload');
  });

});

describe('deleteFileFromSupabase', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('elimina archivo correctamente', async () => {

    const removeMock = jest.fn().mockResolvedValue({
      error: null
    });

    supabase.storage.from.mockReturnValue({
      remove: removeMock
    });

    await deleteFileFromSupabase(
      'https://abc.supabase.co/storage/v1/object/public/videos/test.mp4',
      'videos'
    );

    expect(removeMock).toHaveBeenCalledWith([
      'test.mp4'
    ]);
  });

  test('no hace nada si la URL no contiene el bucket', async () => {

    const removeMock = jest.fn();

    supabase.storage.from.mockReturnValue({
      remove: removeMock
    });

    await deleteFileFromSupabase(
      'https://archivo-invalido.com/test.mp4',
      'videos'
    );

    expect(removeMock).not.toHaveBeenCalled();
  });

  test('maneja error de Supabase sin lanzar excepción', async () => {

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const removeMock = jest.fn().mockResolvedValue({
      error: {
        message: 'Error eliminando'
      }
    });

    supabase.storage.from.mockReturnValue({
      remove: removeMock
    });

    await deleteFileFromSupabase(
      'https://abc.supabase.co/storage/v1/object/public/videos/test.mp4',
      'videos'
    );

    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

});