let express = require('express');
let app = express();

let port = 8000;

app.get('/', (req, res) => {
  res
    .status(200)
    .json({
      message: 'Welcome Morol',
      app: 'eNatours'
    })
})

app.post('/', (req, res) => {
  res
    .status(200)
    .send('Data send success')
})


app.listen(port, () => {
  console.log(`Server running on ${port}`);
});