let fs = require('fs');
let express = require('express');
let app = express();

let port = 8000;

let tours = JSON.parse( 
  fs.readFileSync(`${__dirname}/resources/assets/data/tours-simple.json`)
);

app.get('/', (req, res) => {
  res
    .status(200)
    .json({
      status: "ok",
      length: tours.length,
      data: {
        tours
      }
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