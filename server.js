'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios=require('axios');
const movieData = require('./data.json');
const app = express();

app.use(cors());

const PORT = process.env.PORT;

app.get('/',helloworldhandler);
app.get('/Home',homepagehandler);
app.get('/favorite',favoritepagehandler);
app.get('/trending',terindinghandler);
app.get('/search',searhmoviehandler);
app.use('*',servererror);
app.use('!',notFoundHndler);


let turl = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APITKEY}&language=en-US`;

function Movie(id,title,release_date,poster_path,overview){
    this.id=id;
    this.title=title;
    this.release_date=release_date;
    this.poster_path=poster_path;
    this.overview=overview;

}
function helloworldhandler(req,res){
    return res.status(200).send("Hello world");
}
function homepagehandler(req,res){
  let onemovie = new Movie(movieData.title,movieData.poster_path,movieData.overview)
  //movies.push(onemovie)
  return res.status(200).json(onemovie)
}
function favoritepagehandler(req,res){
    return res.status(200).send("Welcome to Favorite Page");
}
function searhmoviehandler(req,res){
let Surl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.APISKEY}&language=en-US&query=The&page=2`;
 axios.get(Surl).then((data)=>{
     //console.log(data);
     let movies=data.data.results.map(movie=>{
        return new Movie(movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview)
    });
    return res.status(200).json(movies);
 }).catch((err)=>{
   
 })
} 
function terindinghandler(req,res){
axios.get(turl).then((data)=>{
    //console.log(data.data.results);
    let movies=data.data.results.map(movie=>{
        return new Movie(movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview)
    });
    return res.status(200).json(movies);
 }).catch((err)=>{
     
 })
} 
function servererror(req,res){
    return res.status(500).send('Sorry, something went wrong')
}
function notFoundHndler(req,res){
    return res.status(404).send('page not found error')
}
app.listen(3000, ()=>{
    console.log("listening to port 3000");
})
