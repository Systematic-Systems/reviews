const db = require('./db.js');

function formatDate () {
  const query = 'SELECT * FROM reviews';
  db.query(query, (err, results) => {
    if (err) {
      console.log(err)
    } else {
      results.rows.forEach((row) => {
        if(Number.isNaN(Number(row.date))) {
          const date = new Date(row.date).getTime()/1000;
          const id = row.review_id;
          const update = `UPDATE reviews SET date=${date} where review_id=${id}`;
          db.query(update, (err, results) => {
            if (err) {
              console.log(err);
            } else {
              return;
            }
          })
        }
      })
    }
  })
};

formatDate();