const request = require('supertest');
const app = require('../app');
process.env.NODE_ENV = 'test';

describe('JSON /users EDGE CASES', function () {
  /** 
   * Edge Cases: Users don't exist -> all 404's
   */
  test('should 404 GET /users/1.json NONEXISTENT USER', function () {
    return request(app)
      .get('/users/1.json')
      .expect(404);
  });
  test('should 404 GET /users/1/reminders.json NONEXISTENT USER', function () {
    return request(app)
      .get('/users/1/reminders.json')
      .expect(404);
  });
  test('should 404 GET /users/1/reminders/1.json NONEXISTENT USER', function () {
    return request(app)
      .get('/users/1/reminders/1.json')
      .expect(404);
  });
  test('should 404 DELETE /users/1 NONEXISTENT USER', function () {
    return request(app)
      .delete('/users/1')
      .expect(404);
  });
  test('should 404 DELETE /users/1/reminders NONEXISTENT USER', function () {
    return request(app)
      .delete('/users/1/reminders')
      .expect(404);
  });
  test('should 404 DELETE /users/1/reminders/1 NONEXISTENT USER', function () {
    return request(app)
      .delete('/users/1/reminders/1')
      .expect(404);
  });
  // Post with incorrect payload
  test('should 404 CREATE /users MALFORMED BODY', function () {
    return request(app)
      .post('/users')
      .send({
        user: {
          namenamenamename: 'test',
          email: 'test@test.com'
        }
      })
      .expect(404)
      .expect('Content-Type', /json/);
  });
  test('should 404 CREATE /users/1/reminders MALFORMED BODY', function (done) {
    return request(app)
      .post('/users/1/reminders')
      .send({
        reminder: {
          titletitle: 'testtitle',
          description: 'testdescription'
        }
      })
      .expect(404)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        expect(res.text).toEqual(expect.stringContaining(
          'reminder title and description must be specified'
        ));
        done();
      })
  });

});

describe('JSON /users', function () {

  var USER1 = {
    name: 'name',
    email: 'test@test.com'
  };
  var REM1 = {
    title: 'title1',
    description: 'description1'
  };
  var REM2 = {
    title: 'title2',
    description: 'description2'
  };

  /**
   * First User + 2 Reminders Created
   * 
   * From here on we test expected behaviour
   */
  test('should CREATE /users', function (done) {
    return request(app)
      .post('/users')
      .send({
        user: USER1
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        expect(res.body).toEqual({ id: 1 });
        done();
      });
  });

  test('should CREATE /users/1/reminders id=1', function (done) {
    return request(app)
      .post('/users/1/reminders')
      .send({
        reminder: REM1
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        expect(res.body).toEqual({ id: 1 });
        done();
      });
  });
  test('should CREATE /users/1/reminders id=2', function (done) {
    return request(app)
      .post('/users/1/reminders')
      .send({
        reminder: REM2
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        expect(res.body).toEqual({ id: 2 });
        done();
      });
  });
  // GET Created Users
  test('should GET /users/1.json', function (done) {
    return request(app)
      .get('/users/1.json')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        expect(res.body).toEqual({ id: '1', name: USER1.name, email: USER1.email });
        done();
      });
  });
  test('should GET /users/1/reminders.json', function (done) {
    return request(app)
      .get('/users/1/reminders.json')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        expect(res.body.length).toBe(2);
        // Reminder 1
        expect(res.body[0]).toHaveProperty('created');
        expect(res.body[0]).toHaveProperty('id', 1);
        expect(res.body[0]).toHaveProperty('title', REM1.title);
        expect(res.body[0]).toHaveProperty('description', REM1.description);

        // Reminder 2
        expect(res.body[1]).toHaveProperty('created');
        expect(res.body[1]).toHaveProperty('id', 2);
        expect(res.body[1]).toHaveProperty('title', REM2.title);
        expect(res.body[1]).toHaveProperty('description', REM2.description);
        done();
      });
  });
  test('should GET FILTER /users/1/reminders.json BY TITLE', function (done) {
    return request(app)
      .get('/users/1/reminders.json?title=' + REM1.title)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        expect(res.body.length).toBe(1);
        // Only Reminder 1
        expect(res.body[0]).toHaveProperty('created');
        expect(res.body[0]).toHaveProperty('id', 1);
        expect(res.body[0]).toHaveProperty('title', REM1.title);
        expect(res.body[0]).toHaveProperty('description', REM1.description);

        done();
      });
  });
  test('should GET /users/1/reminders/1.json', function (done) {
    return request(app)
      .get('/users/1/reminders/1.json')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        expect(res.body).toHaveProperty('created');
        expect(res.body).toHaveProperty('id', 1);
        expect(res.body).toHaveProperty('title', REM1.title);
        expect(res.body).toHaveProperty('description', REM1.description);
        done();
      });
  });
  test('should GET /users/1/reminders/2.json', function (done) {
    return request(app)
      .get('/users/1/reminders/2.json')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        expect(res.body).toHaveProperty('created');
        expect(res.body).toHaveProperty('id', 2);
        expect(res.body).toHaveProperty('title', REM2.title);
        expect(res.body).toHaveProperty('description', REM2.description);
        done();
      });
  });
  /**
   * DELETE Reminders and try to GET them
   */
  test('should DELETE /users/1/reminders/1', function () {
    return request(app)
      .delete('/users/1/reminders/1')
      .expect(204);
  });
  test('should 404 GET /users/1/reminders/1.json AFTER DELETE', function () {
    return request(app)
      .get('/users/1/reminders/1.json')
      .expect(404);
  });
  test('should GET /users/1/reminders/2.json AFTER DELETE', function (done) {
    return request(app)
      .get('/users/1/reminders/2.json')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        expect(res.body).toHaveProperty('created');
        expect(res.body).toHaveProperty('id', 2);
        expect(res.body).toHaveProperty('title', REM2.title);
        expect(res.body).toHaveProperty('description', REM2.description);
        done();
      });
  });
  test('should DELETE /users/1/reminders', function () {
    return request(app)
      .delete('/users/1/reminders')
      .expect(204);
  });
  test('should 404 GET /users/1/reminders/1.json AFTER FULL DELETE', function () {
    return request(app)
      .get('/users/1/reminders/1.json')
      .expect(404);
  });
  test('should 404 GET /users/1/reminders/2.json AFTER FULL DELETE', function () {
    return request(app)
      .get('/users/1/reminders/2.json')
      .expect(404);
  });
  test('should DELETE /users/1', function () {
    return request(app)
      .delete('/users/1')
      .expect(204);
  });
  test('should 404 GET /users/1.json AFTER DELETE', function () {
    return request(app)
      .get('/users/1.json')
      .expect(404);
  });
});

describe('HTML /users', function () {
  var USER2 = {
    name: 'name2',
    email: 'name2@test.com'
  };
  test('should GET /users', function (done) {
    return request(app)
      .get('/users')
      .expect(200)
      .end(function (err, res) {
        expect(res.redirects.length).toBe(0);
        expect(res.type).toEqual('text/html');
        expect(res.text).not.toEqual(
          expect.stringContaining('deleteUser(') // This means page is empty of users
        );
        expect(res.text).toEqual(
          expect.stringContaining('Here you can see a list of all current users.')
        );
        done();
      });
  });
  test('should GET /users/1', function (done) {
    return request(app)
      .get('/users/1')
      .expect(200)
      .end(function (err, res) {
        expect(res.redirects.length).toBe(0);
        expect(res.type).toEqual('text/html');
        expect(res.text).not.toEqual(
          expect.stringContaining('deleteUser(') // This means page is empty of users
        );
        expect(res.text).toEqual(
          expect.stringContaining('Here you can see a list of all current users.')
        );
        done();
      });
  });
  test('should GET ERROR /users/1/reminders', function (done) {
    return request(app)
      .get('/users/1/reminders')
      .expect(200)
      .end(function (err, res) {
        expect(res.redirects.length).toBe(0);
        expect(res.type).toEqual('text/html');
        expect(res.text).toEqual(
          expect.stringContaining('User ID: ' + 1 + ' does not exist')
        );
        done();
      });
  });
  test('CREATE USER', function (done) {
    return request(app)
      .post('/users')
      .send({
        user: USER2
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        expect(res.body).toEqual({ id: 2 });
        done();
      });
  });
  test('should GET /users/2/reminders', function (done) {
    return request(app)
      .get('/users/2/reminders')
      .expect(200)
      .end(function (err, res) {
        expect(res.redirects.length).toBe(0);
        expect(res.type).toEqual('text/html');
        expect(res.text).not.toEqual(
          expect.stringContaining('User ID: ' + 1 + ' does not exist')
        );
        done();
      });
  });
});

