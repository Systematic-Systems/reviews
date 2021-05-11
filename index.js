const express = require('express');
const db = require('./db/db.js');
// const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

let recent = [];
let recentMeta = [];

const postReviews = (product_id) => {
  const id = product_id;
  const searched = recent.map((product, index) => {
    const item = {product: product, index: index};
    return item;
  }).filter((product) => Number(product.product.id) === id)
  // console.log(searched)
  searched.forEach((item) => {
    recent = recent.splice(item.index-1, 1);
  })
  if (searched.length > 0) {
    const reviewQuery = `SELECT reviews.review_id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness, photos.photo_id, photos.url FROM reviews FULL OUTER JOIN photos ON reviews.review_id = photos.review_id WHERE reviews.product_id = ${id}`;
    db.query(reviewQuery, (err, results) => {
      if (err) {
        console.log(err);
      }
      // console.log(results.rows)
      const reviews = results.rows;
        const data = reviews.map((review) => {
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
            photos: {id: review.photo_id, url: review.url},
          };
          return info;
        }).filter((review) => review !== null);
        if (recent.length === 20) {
          recent.pop();
          recent.unshift({id: id, data: data});
        } else {
          recent.unshift({id: id, data: data});
      }
    });
  }
}

app.get('/', (err, res) => {
  res.status(200).send('Connected');
})

app.get('/reviews', (req, res) => {
  const id = req.query.product_id;
  if (id === undefined) {
    res.status(200).send('Product ID Does Not Exist');
  } else {
    const searched = recent.filter((product) => product.id === id);
  if (searched.length > 0) {
    res.status(200).send(searched[0].data);
  } else {
    const reviewQuery = `SELECT reviews.review_id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness, photos.photo_id, photos.url FROM reviews FULL OUTER JOIN photos ON reviews.review_id = photos.review_id WHERE reviews.product_id = ${id}`;
    db.query(reviewQuery, (err, results) => {
      if (err) {
        console.log(err);
      }
      // console.log(results.rows)
      const reviews = results.rows;
        const data = reviews.map((review) => {
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
            photos: {id: review.photo_id, url: review.url},
          };
            // console.log(info);
          return info;
        });
        res.status(200).send(data);
        if (recent.length === 20) {
          recent.pop();
          recent.unshift({id: id, data: data});
        } else {
          recent.unshift({id: id, data: data});
      }
    });
  }
  }

});

app.get('/reviews/meta/', (req, res) => {
  const id = req.query.product_id;
  if (id === undefined) {
    res.status(200).send('Product ID Does Not Exist');
  } else {
    const searched = recentMeta.filter(product => product.id === id);

    if (searched.length > 0) {
      res.status(200).send(searched[0].data);
    } else {
      const query = `SELECT reviews.review_id, rating, recommend, characteristic_id, value FROM reviews FULL OUTER JOIN characteristics ON reviews.review_id = characteristics.review_id WHERE reviews.product_id = ${id}`;
      db.query(query, (err, results) => {
        const metaResults = results.rows;
        // console.log(metaResults)
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
          if (characteristic !== null) {
            if (tracker[characteristic] === undefined) {
              tracker[characteristic] = {
                id: characteristic,
                currentValue: result.value,
                count: 1,
                value: result.value,
              };
              characteristics[characteristic] = {
                id: characteristic,
                value: result.value,
              };
            } else {
              tracker[characteristic].count += 1;
              tracker[characteristic].currentValue += 1;
              tracker[characteristic].value = tracker[characteristic].currentValue / tracker[characteristic].count;
              characteristics[characteristic].value = tracker[characteristic].value.toFixed(2);
            }
          }
        });
        let data = {
          product_id: id,
          ratings: ratings,
          recommended: recommend,
          characteristics: characteristics,
        };

        const charQuery = `SELECT * FROM characterName WHERE product_id = ${id}`
        db.query(charQuery, (err, results) => {
          if (err) {
            console.log(err)
          } else {
            results.rows.forEach((row) => {
              const charKeys = Object.keys(data.characteristics);
              charKeys.forEach((key) => {
                if (data.characteristics[key].id === row.id) {
                  data.characteristics[row.name] = data.characteristics[key];
                  delete data.characteristics[key];
                }
              })
            })
          }
          res.status(200).send(data);
          if (recentMeta.length === 20) {
            recentMeta.pop();
            recentMeta.unshift({id: id, data: data});
          } else {
            recentMeta.unshift({id: id, data: data});
          }
        })
      });
    }
  }
});

app.post('/reviews', (req, res) => {
  const query = `INSERT INTO reviews (product_id, rating, date, body, recommend, reviewer_email, reviewer_name, summary) VALUES ('${req.body.product_id}', '${req.body.rating}', '${Date.now()}', '${req.body.body}', '${req.body.recommend}', '${req.body.email}', '${req.body.name}', '${req.body.summary}') RETURNING review_id AS review_id`;
  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      const review_id = result.rows[0].review_id;
      console.log('Reviews Success');
      postReviews(req.body.product_id)

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
  })
  res.sendStatus(201);
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  const id = req.params.review_id;
  const query = `SELECT * FROM reviews WHERE review_id=${id}`;
  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
    }
    const review = results.rows;
    const helpfulness = review[0].helpfulness + 1;
    const updateQuery = `UPDATE reviews SET helpfulness = '${helpfulness}' WHERE review_id=${id}`;
    db.query(updateQuery, (err, results) => {
      if (err) {
        console.log(err);
      } else {
        console.log('success');
        const data = {helpfulness: helpfulness}
        res.send(data);
      }
    });
  });
});

app.put('/reviews/:review_id/report', (req, res) => {
  const id = req.params.review_id;
  const query = `UPDATE reviews SET reported = '${true}' WHERE review_id=${id}`;
  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      console.log('success');
      res.sendStatus(201);
    }
  });
});

// const port = 3005;

// app.listen(port, () => {
//   console.log('listening on port', port);
// });

module.exports = app;
