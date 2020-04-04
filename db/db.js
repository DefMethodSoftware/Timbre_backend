const mongoose = require('mongoose');

let url
switch (process.env.NODE_ENV) {
  case 'test':
    url = process.env.MONGODB_TEST
    console.log("Connecting to test DB...")
    break;
  case 'development':
    url = process.env.MONGODB_DEV
    console.log("Connecting to dev DB...")
    break;
  case 'production':
    url = process.env.MONGODB_PROD
    console.log("Connecting to production DB...")
    break;
  default:
    url = process.env.MONGODB_DEV
    console.log("Connecting to dev DB...")
    break;
} 

mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});