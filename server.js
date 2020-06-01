let port = 8000;
let app = require('./app');

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});