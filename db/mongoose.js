const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/SDC');


const mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'connection error:'));
mongoDB.once('open', function() {
  console.log('CONNECTED')
});

let metaSchema = mongoose.Schema({
  // TODO: your schema here!
  product_id: {type: Number, unique: true},
  ratings: {
    '1': String,
    '2': String,
    '3': String,
    '4': String,
    '5': String
  },
  recommended: {
    false: Number,
    true: Number,
  },
  characteristics: {
    Size: {
      id: Number,
      value: Number,
    },
    Width: {
      id: Number,
      value: Number,
    },
    Comfort: {
      id: Number,
      value: Number,
    },
    Quality: {
      id: Number,
      value: Number,
    },
    Length: {
      id: Number,
      value: Number,
    },
    Fit: {
      id: Number,
      value: Number,
    },
  },
});

let MetaData = mongoose.model('MetaData', metaSchema);

let save = (repos) => {

  for (var i = 0; i < repos.length; i ++) {
    console.log('MetaData', repos[i])
    var newRepo = new MetaData(repos[i]);
    newRepo.save();

  }
  // TODO: Your code here
  // This function should save a repo or repos to
  // the MongoDB
}

module.exports = MetaData;