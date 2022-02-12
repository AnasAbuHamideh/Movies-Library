'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios=require('axios');
const movieData = require('./data.json');
const app = express();
const pg=require('pg');
const client=new pg.Client(process.env.DATABASE_URL);
app.use(cors());
app.use(express.json())
const PORT = process.env.PORT;

app.get('/',helloworldhandler);
app.get('/Home',homepagehandler);
app.get('/favorite',favoritepagehandler);
app.get('/trending',terindinghandler);
app.get('/search',searhmoviehandler);

app.post('/addMovie',addmoviehandler);
app.get('/getMovies',getmoviehandler);

app.put('/UPDATE/:id',updatemoviehandler);
app.delete('/DELETE/:id',deletemoviehandler);
app.get('/getMovie/:id',gethandler);

app.use('*',errorHandler);
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
    errorHandler(err,req,res);
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
    errorHandler(err,req,res);
 })
}

function addmoviehandler(req,res){
const movie =req.body;
let sql = `INSERT INTO addMovie(title,release_date,poster_path,overview) VALUES ($1,$2,$3,$4) RETURNING *;`
  let values=[movie.title,movie.release_date,movie.poster_path,movie.overview];
  client.query(sql,values).then(data =>{
      res.status(200).json(data.rows);
  }).catch(error=>{
      errorHandler(error,req,res)
  });
}

function getmoviehandler(req,res){
    let sql = `SELECT * FROM addMovie;`;
    client.query(sql).then(data=>{
       res.status(200).json(data.rows);
    }).catch(error=>{
        errorHandler(error,req,res)
    });

}

function updatemoviehandler(req,res){
    const id = req.params.id;
    console.log(req.params.name);
    const movie = req.body;
    const sql = `UPDATE addMovie SET title =$1, release_date = $2, poster_path = $3 ,overview=$4 WHERE id=$5 RETURNING *;`; 
    let values=[movie.title,movie.release_date,movie.poster_path,movie.overview,id];
    client.query(sql,values).then(data=>{
        res.status(200).json(data.rows);
    }).catch(error=>{
        errorHandler(error,req,res)
    });
}
function deletemoviehandler(req,res){
        const id = req.params.id;
        const sql = `DELETE FROM addMovie WHERE id=${id};` 
    
        client.query(sql).then(()=>{
            res.status(200).send("The Movie has been deleted");
        }).catch(error=>{
            errorHandler(error,req,res)
        });
    }

function gethandler(req,res){

        let sql = `SELECT * FROM addMovie WHERE id=${req.params.id};`;
    
        client.query(sql).then(data=>{
           res.status(200).json(data.rows);
        }).catch(error=>{
            errorHandler(error,req,res)
        });
    }
function errorHandler(req,res){
    const err={
        status:500,
        message:'Sorry, something went wrong'
    }
    return res.status(500).send(err);
}

function notFoundHndler(req,res){
    return res.status(404).send('page not found error')
}

// client.connect().then(()=>{
//     app.listen(PORT,()=>{
//         console.log(`listining to port ${PORT}`)
//     })
// })
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
})
