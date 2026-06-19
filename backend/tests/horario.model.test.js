const HorarioModel = require('../models/horario.model');
const supabase = require('../config/db');

jest.mock('../config/db', () => ({
  from: jest.fn()
}));

describe('HorarioModel', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    test('retorna horarios correctamente', async () => {
      const mockData = [
        { id: 1, horas: '8:00-17:00', abierto: true }
      ];

      supabase.from.mockReturnValue({
        select: () => ({
          order: () => ({
            data: mockData,
            error: null
          })
        })
      });

      const result = await HorarioModel.getAll();

      expect(result).toEqual(mockData);
    });

    test('lanza error si Supabase falla', async () => {
      supabase.from.mockReturnValue({
        select: () => ({
          order: () => ({
            data: null,
            error: new Error('DB Error')
          })
        })
      });

      await expect(HorarioModel.getAll())
        .rejects
        .toThrow('DB Error');
    });
  });

  describe('update', () => {
    test('actualiza horario correctamente', async () => {
      const mockData = {
        id: 1,
        horas: '9:00-18:00',
        abierto: false
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

      const result = await HorarioModel.update(1, {
        horas: '9:00-18:00',
        abierto: false
      });

      expect(result).toEqual(mockData);
    });

    test('lanza error si update falla', async () => {
      supabase.from.mockReturnValue({
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => ({
                data: null,
                error: new Error('Update Error')
              })
            })
          })
        })
      });

      await expect(
        HorarioModel.update(1, {
          horas: '9:00-18:00',
          abierto: false
        })
      ).rejects.toThrow('Update Error');
    });
  });
});