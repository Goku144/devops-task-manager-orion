const request = require('supertest'); 
const app = require('../src/app'); 
 
test('Health check', async () => { 
  const res = await request(app).get('/'); 
  expect(res.statusCode).toBe(200); 
})