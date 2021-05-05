const pg = require('pg');

const db = new pg.Client({
  user: 'CalebIuliano',
  host: 'localhost',
  database: 'SDC',
  port: 5432,
});
db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected');
  }
});
db.on('error', err => {
  console.log(err);
});

module.exports = db;
