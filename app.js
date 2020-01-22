require('dotenv').config();
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

app.use(function validateBearerToken(req, res, next) {
  const authVal = req.get('Authorization') || '';

  if(!authVal.startsWith('Bearer')) {
    return res.status(400).json({ error: "Missing or incorrect Authorization header"});
  }
  const token = authVal.split(' ')[1]
  if(!authVal || token !== API_TOKEN) {
    return res.status(401).json({error: 'Invalid credentials'});
  }
  //move to the next middleware
  next();
})


function handleMovies(req, res) {
  let filteredMovies = [...movies]

  const { genre, country, avg_vote } = req.query

  const acceptedGenres = ['Animation', 'Comedy', 'War', 'Thriller', 'Drama', 'Western', 'Crime', 'Grotesque', 'Romantic', 'Fantasy', 'Musical', 'Biography', 'History', 'Adventure', 'Spy'];

  if(genre) {
    if(!acceptedGenres.includes(genre)){
      return res.status(400).json({ error: "Genres must be one of: Action, Puzzle, Strategy, Casual, Arcade, Card "});
    }
      //using the copied app data(you don't want to use the original imported data)filter for each app, check that the Genres key matches the req.query.genres value and assign the new array as filteredApps
      filteredMovies = filteredMovies.filter(eachApp => eachApp.genre.includes(genre))
  }
}

app.get('/movie', handleMovies);


app.listen(8000, () => {
  console.log('Server started on PORT 8000');
});