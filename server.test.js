const request = require('supertest');
const app = require('./index.js');
const db = require('./db/db.js');

app.get('/test', (req, res) => {
  res.status = 200;
  res.send('passed!');
});

describe('test route', () => {
  it('should return the 200 status code', (done) => {
    request(app)
      .get('/test')
      .expect(200)
      .then((res) => {
        return done();
      })
      .catch((err) => {
        return done(err)
      });
  });

  it('should return the sent response', (done) => {
    request(app)
      .get('/test')
      .expect('passed!')
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});

app.get('/reviews/', (req, res) => {
  res.status = 200;
  res.send(200);
});

describe('reviews route', () => {
  const id = 1902;
  it('should return the 200 status code', (done) => {
    request(app)
      .get(`/reviews/?product_id=${id}`)
      .expect(200)
      .then((res) => {
        return done();
      })
      .catch((err) => {
        return done(err)
   });
  });

  it('should return the sent response', (done) => {
    request(app)
      .get(`/reviews/`)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});

app.get('/reviews/meta/', (req, res) => {
  res.status = 200;
  res.send('passed!');
});

describe('reviews route', () => {
  const id = 19289
  it('should return the 200 status code', (done) => {
    request(app)
      .get(`/reviews/meta/?product_id=${id}`)
      .expect(200)
      .then((res) => {
        return done();
      })
      .catch((err) => {
        return done(err)
    });
  });

  it('should return the sent response', (done) => {
    request(app)
      .get(`/reviews/meta/?product_id=${id}`)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if(err) return done(err);
        return done();
      });
  });
});