const express = require('express');
require("dotenv").config();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors()); 
app.use(bodyParser.json()); 

app.get('/', (req, res) => {
  res.send('Hello World from Express!');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});