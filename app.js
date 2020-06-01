let fs = require('fs');
let express = require('express');
let app = express();

app.use(express.json());

let port = 8000;

let tours = JSON.parse( 
  fs.readFileSync(`${__dirname}/resources/assets/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
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

app.post('/api/v1/tours', (req, res) => {
  let newId = tours[tours.length - 1].id + 1;
  let newTour = Object.assign({id: newId}, req.body);

  tours.push(newTour);

  fs.writeFile(`${__dirname}/resources/assets/data/tours-simple.json`, 
    JSON.stringify(tours), (err) => {
      res.status(201).json({
        status: 'ok',
        data: {
          tour: newTour
        }
      })
    })
})


app.listen(port, () => {
  console.log(`Server running on ${port}`);
});