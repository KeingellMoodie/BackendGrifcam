const VideoModel = require('../models/video.model');
const supabase = require('../config/db');

jest.mock('../config/db', () => ({
  from: jest.fn()
}));

describe('VideoModel', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getAll retorna videos', async () => {
    const mockData = [
      { id: 1, titulo: 'Video 1' }
    ];

    supabase.from.mockReturnValue({
      select: () => ({
        order: () => ({
          data: mockData,
          error: null
        })
      })
    });

    const result = await VideoModel.getAll();

    expect(result).toEqual(mockData);
  });

  test('create crea video', async () => {
    const mockData = {
      id: 1,
      titulo: 'Video',
      url: 'https://youtube.com'
    };

    supabase.from.mockReturnValue({
      insert: () => ({
        select: () => ({
          single: () => ({
            data: mockData,
            error: null
          })
        })
      })
    });

    const result = await VideoModel.create({
      titulo: 'Video',
      url: 'https://youtube.com',
      orden: 1
    });

    expect(result).toEqual(mockData);
  });

  test('update actualiza video', async () => {
    const mockData = {
      id: 1,
      titulo: 'Editado',
      orden: 2
    };

    supabase.from.mockReturnValue({
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => ({
              data: mockData,
              error: null
            })
          })
        })
      })
    });

    const result = await VideoModel.update(1, {
      titulo: 'Editado',
      orden: 2
    });

    expect(result).toEqual(mockData);
  });

  test('delete elimina video', async () => {
    const mockData = {
      id: 1,
      url: 'https://youtube.com'
    };

    supabase.from.mockReturnValue({
      delete: () => ({
        eq: () => ({
          select: () => ({
            single: () => ({
              data: mockData,
              error: null
            })
          })
        })
      })
    });

    const result = await VideoModel.delete(1);

    expect(result).toEqual(mockData);
  });

  test('delete ignora error PGRST116', async () => {
    supabase.from.mockReturnValue({
      delete: () => ({
        eq: () => ({
          select: () => ({
            single: () => ({
              data: null,
              error: {
                code: 'PGRST116'
              }
            })
          })
        })
      })
    });

    const result = await VideoModel.delete(1);

    expect(result).toBeNull();
  });

  test('delete lanza error distinto de PGRST116', async () => {
    supabase.from.mockReturnValue({
      delete: () => ({
        eq: () => ({
          select: () => ({
            single: () => ({
              data: null,
              error: new Error('Delete Error')
            })
          })
        })
      })
    });

    await expect(
      VideoModel.delete(1)
    ).rejects.toThrow('Delete Error');
  });
});