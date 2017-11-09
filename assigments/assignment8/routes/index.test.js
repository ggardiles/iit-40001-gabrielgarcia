const request = require('supertest');
const app = require('../app');
process.env.NODE_ENV = 'test';

describe('HTML /', () => {
  test('should GET / HTML', (done) => {
    return request(app)
      .get('/')
      .expect(200)
      .end(function (err, res) {
        expect(res.redirects.length).toBe(0);
        expect(res.type).toEqual('text/html');
        expect(res.text).toEqual(
          expect.stringContaining('Try the platform of the future for user management.')
        );
        done();
      });
  });
  test('should 404 GET /wrongpath HTML', (done) => {
    return request(app)
      .get('/wrongpath')
      .expect(404)
      .end(function (err, res) {
        expect(res.redirects.length).toBe(0);
        expect(res.type).toEqual('text/html');
        expect(res.text).toEqual(
          expect.stringContaining('Not Found')
        );
        done();
      });
  });
})