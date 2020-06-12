let mongoose = require('mongoose');
let dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './env/config.env' });
let app = require('./app');

//console.log(app.get('env')) // development
let db = process.env.DATABASE.replace(
  '<password>', 
  process.env.DATABASE_PASSWORD
)

mongoose
  .connect(process.env.DATABASE_LOCAL, { 
  //.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
 }).then(()  => console.log('DB connect successfull'));

let port = process.env.PORT || 3000;
let server = app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

process.on('unhandleRejection', err => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  })
});
