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

function handleMovies(req, res) {
  res.json(movies);
}

function validateBearerToken(req, res, next) {
  const authVal = req.get("Authorization") || " ";

  if(!authVal.startsWith('Bearer')) {
    return res.status(400).json({ error: "Missing or incorrect Authorization header"});
  }
  const token = authVal.split(' ')[1]
  if(token !== API_TOKEN) {
    return res.status(401).json("Invalid credentials");
  }

  next();
}

app.get('/movie', validateBearerToken. handleMovies);


app.listen(8000, () => {
  console.log('Server started on PORT 8000');
});