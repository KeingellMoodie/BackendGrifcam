const PoliticasModel = require('../models/politicas.model');
const supabase = require('../config/db');

jest.mock('../config/db', () => ({
  from: jest.fn()
}));

describe('PoliticasModel', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getAll retorna políticas', async () => {
    const mockData = [
      {
        id: 1,
        titulo: 'Política',
        contenido: 'Contenido'
      }
    ];

    supabase.from.mockReturnValue({
      select: () => ({
        order: () => ({
          data: mockData,
          error: null
        })
      })
    });

    const result = await PoliticasModel.getAll();

    expect(result).toEqual(mockData);
  });

  test('update actualiza política', async () => {
    const mockData = {
      id: 1,
      titulo: 'Nueva',
      contenido: 'Texto'
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

    const result = await PoliticasModel.update(1, {
      titulo: 'Nueva',
      contenido: 'Texto'
    });

    expect(result).toEqual(mockData);
  });

  test('update lanza error', async () => {
    supabase.from.mockReturnValue({
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => ({
              data: null,
              error: new Error('Error update')
            })
          })
        })
      })
    });

    await expect(
      PoliticasModel.update(1, {
        titulo: 'Nueva',
        contenido: 'Texto'
      })
    ).rejects.toThrow('Error update');
  });
});