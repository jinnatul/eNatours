let mongoose = require('mongoose');
let dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
let app = require('./app');

//console.log(app.get('env')) // development
let db = process.env.DATABASE.replace(
  '<password>', 
  process.env.DATABASE_PASSWORD
)

mongoose
//.connect(process.env.DATABASE_LOCAL, { 
  .connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false 
 }).then(()  => console.log('DB connect successfull'));

let port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});