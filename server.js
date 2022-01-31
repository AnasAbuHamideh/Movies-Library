const express = require('express');
const cors = require('cors');

const movieData = require('./data.json');
const app = express();

app.use(cors());

app.get('/',helloworldhandler);
app.get('/Home',homepagehandler);
app.get('/favorite',favoritepagehandler);
app.get('*',servererror);
app.get('$',notFoundHndler)

function Movie(title,poster_path,overview){
    this.title=title;
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
function favoritepagehandler(){
    return res.status(200).send("Welcome to Favorite Page");
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
