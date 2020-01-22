const express = require('express');
const morgan = require('morgan');

const app = express();
const cors = require('cors');
const helmet = require('helmet')

app.use(cors());
app.use(helmet()); 
app.use(morgan('common')); // let's see what 'common' format looks like

const movies= require('./movieData.js');

const API_TOKEN = process.env.API_TOKEN

app.get('/movie', (req, res) => {
  res.json(movies);
});

app.listen(8000, () => {
  console.log('Server started on PORT 8000');
});