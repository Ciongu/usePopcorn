import NavBar from "./components/navbar/NavBar";
import Main from "./components/Main/Main";
import { useState } from "react";
import NumResults from "./components/NumResults/NumResults";
import Search from "./components/Search/Search";
import Box from "./components/ListBox/ListBox";
import MovieList from "./components/List/List";
import Summary from "./components/Summary/Summary";
import WatchedMovieList from "./components/WatchedList/WatchedMovieList";
import Loader from "./components/Loader/Loader";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import SelectedMovie from "./components/SelectedMovie/selectedMovie";
import { useMovies } from "./hooks/useMovies";
import { useLocalStorageState } from "./hooks/useLocalStorageState";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const [watched, setWatched] = useLocalStorageState([], "watched");

  const { movies, error, isLoading } = useMovies(query);

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
