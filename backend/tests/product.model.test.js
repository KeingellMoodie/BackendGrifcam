jest.mock('../config/db', () => ({
  from: jest.fn()
}));

const supabase = require('../config/db');
const ProductModel = require('../models/product.model');

describe('ProductModel.findById', () => {

  test('retorna producto ordenando imágenes', async () => {

    const singleMock = jest.fn().mockResolvedValue({
      data: {
        id: '1',
        name: 'Producto',
        product_images: [
          { image_order: 2 },
          { image_order: 0 },
          { image_order: 1 }
        ]
      },
      error: null
    });

    const eqMock = jest.fn(() => ({
      single: singleMock
    }));

    supabase.from.mockReturnValue({
      select: () => ({
        eq: eqMock
      })
    });

    const result = await ProductModel.findById('1');

    expect(result.product_images[0].image_order).toBe(0);
    expect(result.product_images[1].image_order).toBe(1);
    expect(result.product_images[2].image_order).toBe(2);
  });

  test('retorna null cuando no existe', async () => {

    const singleMock = jest.fn().mockResolvedValue({
      data: null,
      error: null
    });

    const eqMock = jest.fn(() => ({
      single: singleMock
    }));

    supabase.from.mockReturnValue({
      select: () => ({
        eq: eqMock
      })
    });

    const result = await ProductModel.findById('1');

    expect(result).toBeNull();
  });

});