import { useState, useEffect } from "react";
import { API_KEY } from "./config";

export default function SearchResult({ query, setSearchResults, onSetid }) {
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [isopen, setIsOpen] = useState(true);
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovie() {
        try {
          if (query.length < 3) return;
          setLoading(true);
          const res = await fetch(
            `https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`,
            { signal: controller.signal }
          );
          const data = await res.json();
          setLoading(false);
          if (data.Response === "False") throw new Error("Movie Not found");
          setMovies(data?.Search);
          setSearchResults(data?.Search);
        } catch (error) {
          if (error.name === "AbortError") return;
          setLoading(false);
          setError(error.message);
        }
      }

      fetchMovie();
      return function () {
        controller.abort();
      };
    },
    [query, setMovies, setSearchResults]
  );

  return (
    <div className="search-result">
      <button onClick={() => setIsOpen((e) => !e)} className="btn">
        {isopen ? "-" : "+"}
      </button>
      {isopen && (
        <ul>
          {loading ? (
            <p className="loading">Loading...</p>
          ) : (
            movies?.map((movie) => (
              <SearchResultList
                key={movie.imdbID}
                onSelect={onSetid}
                movie={movie}
              />
            ))
          )}
          {error && <p className="error">{error}</p>}
        </ul>
      )}
    </div>
  );
}

function SearchResultList({ movie, onSelect }) {
  const [count, setCount] = useState(0);
  return (
    <li
      onClick={() => {
        if (count === 2) setCount((e) => e - 1);
        if (count !== 2) setCount((e) => e + 1);
        onSelect(movie.imdbID, count);
      }}
    >
      <img alt={movie.Title} src={movie.Poster} />
      <div>
        <h3>{movie?.Title}</h3>
        <p>{movie.Year}</p>
      </div>
    </li>
  );
}
