DROP TABLE IF EXISTS addMovie;

CREATE TABLE IF NOT EXISTS addMovie (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    release_date VARCHAR(10000),
    poster_path VARCHAR(10000),
    overview VARCHAR(255)
);

-- movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview