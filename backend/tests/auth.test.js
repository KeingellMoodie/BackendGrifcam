const request = require('supertest')
const app = require('../server')

describe('POST /api/auth/login', () => {

  test('login correcto devuelve token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'angelo',
        password: 'grifcam2026'
      });

    console.log(res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('contrasena incorrecta devuelve 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'angelo', password: 'incorrecta' })
    expect(res.statusCode).toBe(401)
  })

  test('usuario inexistente devuelve 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'noexiste', password: '123' })
    expect(res.statusCode).toBe(401)
  })

  test('campos vacios devuelven 400', async () => {
    const res = await request(app)
      .post('/api/auth/login').send({})
    expect(res.statusCode).toBe(400)
  })
})

describe('Rutas protegidas sin token', () => {

  test('POST /api/products sin token devuelve 401', async () => {
    const res = await request(app).post('/api/products')
    expect(res.statusCode).toBe(401)
  })

  test('DELETE /api/products/:id sin token devuelve 401', async () => {
    const res = await request(app).delete('/api/products/cualquier-id')
    expect(res.statusCode).toBe(401)
  })
})
