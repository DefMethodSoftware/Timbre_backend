const mongoose = require('mongoose');

let url
process.env.NODE_ENV === 'test' ?
url = 'timbre_test' :
url = 'timbre_dev'
console.log("Connecting to ", url, " DB...")

mongoose.connect(`mongodb://127.0.0.1:27017/${url}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});