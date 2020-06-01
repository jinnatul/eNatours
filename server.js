let dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
let app = require('./app');

//console.log(app.get('env')) // development

let port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});