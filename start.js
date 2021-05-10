const app = require('./index.js');
const db = require('./db/db.js');

const port = 3005;

app.listen(port, () => {
  console.log('listening on ', port);
});