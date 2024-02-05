import { useEffect, useState } from "react";
import StarRating from "../StarRating/StarRating.js";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

export default function SelectedMovie({
  movieId,
  onCloseMovie,
  onAddWatched,
  watchedMovies,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState("");
  const [movie, setMovie] = useState({});

  const isWatched = watchedMovies
    .map((movie) => movie.imdbId)
    .includes(movieId);

  const watchedUserRating = watchedMovies.find(
    (movie) => movieId === movie.imdbId
  )?.userRating;

  const {
    Title: title,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Genre: genre,
    Director: director,
  } = movie;

  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          onCloseMovie();
        }
      }

      document.addEventListener("keydown", callback);

      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [onCloseMovie]
  );

  useEffect(
    function () {
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  useEffect(
    function () {
      const controller = new AbortController();

      setIsLoading(true);
      async function fetchMovie() {
        try {
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=675809bb&i=${movieId}`,
            { signal: controller.signal }
          );

          if (!res.ok) throw new Error("Something went wrong. Try Again!");
          const data = await res.json();
          setMovie(data);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      fetchMovie();

      return function () {
        controller.abort();
      };
    },
    [movieId]
  );

  function handleAdd() {
    const newWatchedMovie = {
      imdbId: movieId,
      title,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating: userRating,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  return (
    <div className="details">
      {isLoading && <Loader />}
      {movie && !isLoading && (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 ? (
                    <button className="btn-add" onClick={() => handleAdd()}>
                      + Add to List
                    </button>
                  ) : null}{" "}
                </>
              ) : (
                <p>You rated this movie {watchedUserRating}🌟 </p>
              )}
            </div>

            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
      {error && <ErrorMessage err={error} />}
    </div>
  );
}
