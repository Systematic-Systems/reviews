const express = require('express');
const db = require('./db/db.js');
// const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

app.get('/reviews', (req, res) => {
  const id = req.query.product_id;
  const reviewQuery = `SELECT * FROM reviews FULL OUTER JOIN photos ON photos.review_id = reviews.id WHERE product_id=${id}`;
  db.query(reviewQuery, (err, results) => {
    if (err) {
      console.log(err);
    }
    const review = results.rows[0];
    const data = {
      review_id: review.review_id,
      product_id: review.product_id,
      rating: review.rating,
      date: review.date,
      summary: review.summary,
      body: review.body,
      recommend: review.recommend,
      reported: review.reported,
      reviewer_name: review.reviewer_name,
      reviewer_email: review.reviewer_email,
      response: review.response,
      helpfulness: review.helpfulness,
      photos: [{
        id: review.id,
        url: review.url,
      }],
    };
    res.send(data);
  });
});

app.get('/meta', (req, res) => {

});

app.post('/reviews', (req, res) => {

});

app.put('/reviews/:review_id/helpful', (req, res) => {
  const id = req.params.review_id;
  const query = `SELECT * FROM reviews WHERE id=${id}`;
  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
    }
    const review = results.rows;
    const helpfulness = review[0].helpfulness + 1;
    const updateQuery = `UPDATE reviews SET helpfulness = '${helpfulness}' WHERE id=${id}`;
    db.query(updateQuery, (err, results) => {
      if (err) {
        console.log(err);
      } else {
        console.log('success');
        res.sendStatus(200);
      }
    });
  });
});

app.put('/reviews/:review_id/report', (req, res) => {
  const id = req.params.review_id;
  const query = `UPDATE reviews SET reported = '${true}' WHERE id=${id}`;
  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      console.log('success');
      res.sendStatus(200);
    }
  });
});

const port = 3005;

app.listen(port, () => {
  console.log('listening on port', port);
});