require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

const app = express();
const cors = require('cors');
const helmet = require('helmet')

app.use(cors());
app.use(helmet()); 
app.use(morgan('dev')); 

const movies= require('./movieData.js');

const API_TOKEN = process.env.API_TOKEN

app.use(function validateBearerToken(req, res, next) {
  const authVal = req.get('Authorization') || '';

  if(!authVal.startsWith('Bearer')) {
    return res.status(400).json({ error: "Missing or incorrect Authorization header"});
  }
  const token = authVal.split(' ')[1];
  if(!authVal || token !== API_TOKEN) {
    return res.status(401).json({error: 'Invalid credentials'});
  }
  //move to the next middleware
  next();
})


app.get('/movie', function handleMovies(req, res) {
  let filteredMovies = [...movies]

  const { genre, country, avg_vote } = req.query

  if(genre) {

    filteredMovies = filteredMovies.filter(eachMovie => eachMovie.genre.toLowerCase().includes(genre.toLowerCase()))
  }

  if(country) {
    filteredMovies.filter(eachMovie => {
      eachMovie.genre.toLowerCase().includes(country.toLowerCase())
    });
  }

  if(avg_vote) {
    filteredMovies.filter(eachMovie => {
      Number(eachMovie.avg_vote) >= Number(avg_vote)
    });
  }
  
  res.json(filteredMovies);
})


app.listen(8000, () => {
  console.log('Server started on PORT 8000');
});