const express = require('express');
const db = require('./db/db.js');
// const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

app.get('/reviews', (req, res) => {
  const id = req.query.product_id;
  const reviewQuery = `SELECT * FROM reviews FULL OUTER JOIN photos ON  reviews.id = photos.review_id WHERE product_id=${id} LIMIT 10`;
  db.query(reviewQuery, (err, results) => {
    if (err) {
      console.log(err);
    }
    const reviews = results.rows;
    const data = reviews.map((review) => {
      if (review.id !== null) {
        const info = {
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
        return info;
      }
      return null;
    }).filter((review) => review !== null);
    // console.log(data);
    res.send(data);
  });
});

app.get('/reviews/meta/', (req, res) => {
  const id = req.query.product_id;
  const query = `SELECT review_id, rating, recommend, characteristic_id, value FROM reviews FULL OUTER JOIN characteristics ON reviews.id = characteristics.review_id WHERE product_id=${id}`;
  db.query(query, (err, results) => {
    const metaResults = results.rows;
    let reviews = {
    };
    let ratings = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    let recommend = { true: 0, false: 0, };
    let tracker = {

    };
    let characteristics = {

    };
    metaResults.forEach((result) => {
      const reviewID = result.review_id;
      if (reviews[reviewID] === undefined) {
        reviews[reviewID] = true;
        const currentRating = result.rating;
        ratings[currentRating] += 1;
        if (result.recommend) {
          recommend.true += 1;
        } else {
          recommend.false += 1;
        }
      }
      const characteristic = result.characteristic_id;
      if (tracker[characteristic] === undefined) {
        tracker[characteristic] = {
          id: characteristic,
          value: result.value,
          count: 1,
          ave: result.value,
        };
        characteristics[characteristic] = {
          id: characteristic,
          ave: result.value,
        };
      } else {
        tracker[characteristic].count += 1;
        tracker[characteristic].value += 1;
        tracker[characteristic].ave = tracker[characteristic].value / tracker[characteristic].count;
        characteristics[characteristic].ave = tracker[characteristic].ave;
      }
    });
    const data = {
      product_id: id,
      ratings: ratings,
      recommended: recommend,
      characteristics: characteristics,
    };
    // console.log(data);
    res.send(data);
  });
});

app.post('/reviews', (req, res) => {
  const query = `INSERT INTO reviews (product_id, rating, date, body, recommend, reviewer_email, reviewer_name, summary) VALUES ('${req.body.product_id}', '${req.body.rating}', '${Date.now()}', '${req.body.body}', '${req.body.recommend}', '${req.body.email}', '${req.body.name}', '${req.body.summary}') RETURNING id AS review_id`;
  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      const review_id = result.rows[0].review_id;
      console.log('Reviews Success');

      const photos = req.body.photos;
      photos.forEach((photo) => {
        const photoQuery = `INSERT INTO photos (review_id, url) VALUES ('${Number(review_id)}', '${photo}')`;
        db.query(photoQuery, (err, results) => {
          if (err) {
            console.log(err);
          } else {
            console.log('Photos Success');
          }
        });
      });

      //Iterate through characteristics
      for (let key in req.body.characteristics) {
        const char = req.body.characteristics[key];
        const charQuery = `INSERT INTO characteristics (review_id, characteristic_id, value) VALUES ('${Number(review_id)}', '${char.id}', '${char.value}')`;
        db.query(charQuery, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Characteristics Success');
        }
      });
      }
    }
  });

  res.sendStatus(200);
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
