const request = require('supertest')
const app = require('../server')

let token, categoriaId, productoId

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ username: 'angelo', password: 'grifcam2026' })
  token = res.body.token
  const resCats = await request(app).get('/api/categories')
  console.log(resCats.body)
  categoriaId = resCats.body[0].id
})

describe('GET /api/products', () => {
  test('devuelve lista de productos', async () => {
    const res = await request(app).get('/api/products')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})

describe('POST /api/products', () => {
  test('crea producto con datos validos', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', 'Bearer ' + token)
      .field('name', 'Producto de prueba')
      .field('description', 'Descripcion de prueba')
      .field('price', '1500')
      .field('category_id', categoriaId)
      .field('is_offer', 'false')
      .field('is_new', 'true')
      .field('is_featured', 'false')
    expect(res.statusCode).toBe(201)
    console.log('POST PRODUCT =>', res.body)
    productoId = res.body.product.id
  })
  test('falla sin nombre', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', 'Bearer ' + token)
      .field('price', '1000')
      .field('category_id', categoriaId)
    expect(res.statusCode).toBe(400)
  })
})

describe('GET /api/products/:id', () => {
  test('devuelve el producto creado', async () => {
    const res = await request(app).get('/api/products/' + productoId)
    expect(res.statusCode).toBe(200)
    expect(res.body.name).toBe('Producto de prueba')
  })
  test('devuelve 404 para ID inexistente', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000'

  const res = await request(app)
    .get('/api/products/' + fakeId)
    expect(res.statusCode).toBe(404)
  })
})

describe('PUT /api/products/:id', () => {
  test('edita el producto correctamente', async () => {
    const res = await request(app)
      .put('/api/products/' + productoId)
      .set('Authorization', 'Bearer ' + token)
      .field('name', 'Producto editado')
      .field('price', '2000')
      .field('category_id', categoriaId)
      .field('is_offer', 'true')
      .field('is_new', 'false')
      .field('is_featured', 'false')
    expect(res.statusCode).toBe(200)
  })
})

describe('DELETE /api/products/:id', () => {
  test('elimina el producto correctamente', async () => {
    const res = await request(app)
      .delete('/api/products/' + productoId)
      .set('Authorization', 'Bearer ' + token)
    expect(res.statusCode).toBe(200)
  })
})
