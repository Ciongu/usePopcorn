import NavBar from "./components/navbar/NavBar";
import Main from "./components/Main/Main";
import { useEffect, useState } from "react";
import NumResults from "./components/NumResults/NumResults";
import Search from "./components/Search/Search";
import Box from "./components/ListBox/ListBox";
import MovieList from "./components/List/List";
import Summary from "./components/Summary/Summary";
import WatchedMovieList from "./components/WatchedList/WatchedMovieList";
import Loader from "./components/Loader/Loader";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import SelectedMovie from "./components/SelectedMovie/selectedMovie";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

const APIkey = "675809bb";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  // const [watched, setWatched] = useState([]);
  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem("watched");
    return JSON.parse(storedValue);
  });

  function handleSelectMovie(id) {
    setSelectedId(id === selectedId ? null : id);
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbId !== id));
  }

  useEffect(
    function () {
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError(false);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${APIkey}&s=${query}`
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");
          setMovies(data.Search);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 2) {
        setMovies([]);
        setError("");
        return;
      }
      handleCloseMovie();
      fetchMovies();
    },
    [query]
  );

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        {/* <Box element={<MovieList movies={movies} />} /> */}
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              onSelectMovie={handleSelectMovie}
              onAddWatched={handleAddWatched}
            />
          )}
          {error && <ErrorMessage err={error} />}
        </Box>
        <Box>
          {!selectedId ? (
            <>
              <Summary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          ) : (
            <SelectedMovie
              movieId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watchedMovies={watched}
            />
          )}
        </Box>
      </Main>
    </>
  );
}
