const request = require('supertest')
const app = require('../server')

let token

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ username: 'angelo', password: 'grifcam2026' })
  token = res.body.token
})

describe('GET /api/business', () => {
  test('devuelve la informacion del negocio', async () => {
    const res = await request(app).get('/api/business')
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('telefono')
  })
})

describe('PUT /api/business/:id', () => {
  test('actualiza el telefono correctamente', async () => {
    const res = await request(app)
      .put('/api/business/fa123191-9b8f-4c76-a6e2-d441826b66cc')
      .set('Authorization', 'Bearer ' + token)
      .send({ telefono: '60000000' })
    expect(res.statusCode).toBe(200)
  })
  test('falla sin autenticacion', async () => {
    const res = await request(app)
      .put('/api/business/fa123191-9b8f-4c76-a6e2-d441826b66cc')
      .send({ telefono: '60000000' })
    expect(res.statusCode).toBe(401)
  })
})
