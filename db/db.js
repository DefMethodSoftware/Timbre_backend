const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/timbre_dev', {
  useNewUrlParser: true,
  useCreateIndex: true,
});