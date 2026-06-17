const request = require('supertest')
const app = require('../server')

let token, categoriaId

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ username: 'angelo', password: 'grifcam2026' })
  token = res.body.token
  console.log('POST category =>', res.body)
})


describe('GET /api/categories', () => {
  test('devuelve lista de categorias', async () => {
    const res = await request(app).get('/api/categories')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})

describe('POST /api/categories', () => {
  test('crea categoria con nombre valido', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', 'Bearer ' + token)
      .send({ name: 'Categoria___' })
    expect(res.statusCode).toBe(201)
    console.log(res.body)
    categoriaId = res.body.category.id
  })
  test('falla sin nombre', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', 'Bearer ' + token)
      .send({})
    expect(res.statusCode).toBe(400)
  })
})

describe('PUT /api/categories/:id', () => {
  test('edita el nombre de la categoria', async () => {
    const res = await request(app)
      .put('/api/categories/' + categoriaId)
      .set('Authorization', 'Bearer ' + token)
      .send({ name: 'Categoria editada' })
    expect(res.statusCode).toBe(200)
  })
})

describe('DELETE /api/categories/:id', () => {
  test('elimina la categoria correctamente', async () => {
    const res = await request(app)
      .delete('/api/categories/' + categoriaId)
      .set('Authorization', 'Bearer ' + token)
    expect(res.statusCode).toBe(200)
  })
})
