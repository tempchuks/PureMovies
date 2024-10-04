import { useState, useEffect, useRef } from "react";
import { API_KEY } from "./config";
import StarFunc from "./StarRating";

export default function Details({
  imdbid,
  setDetails,
  setWatchedList,
  watchedList,
}) {
  const [movieDetails, setMovieDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const check = useRef(null);

  useEffect(
    function () {
      if (!imdbid) return;
      const controller = new AbortController();
      setIsLoading(true);
      try {
        function fetchDetails() {
          async function getDetails() {
            if (!imdbid) return;
            const res = await fetch(
              `https://www.omdbapi.com/?i=${imdbid}&apikey=${API_KEY}`,
              { signal: controller.signal }
            );
            const data = await res.json();
            setMovieDetails(data);
            document.title = `Movie: ${data.Title}`;
            setIsLoading(false);
          }
          getDetails();
        }
        fetchDetails();
      } catch (error) {
        console.error(error.message);
        if (error.name === "AbortError") return;
      } finally {
        setDetails(false);
        check.current = watchedList?.find((v) => v.imdbID === imdbid);
        if (check.current) return;
        setMovieDetails(check.current);
      }
    },
    [setMovieDetails, imdbid, setDetails, watchedList]
  );

  useEffect(function () {
    return () => {
      document.title = "PureMovies";
    };
  }, []);

  const [rating, SetRating] = useState(null);

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="details">
          <button
            onClick={() => setDetails(true)}
            style={{
              float: "left",
              backgroundColor: "greenyellow",
              width: "30px",
              border: "none",
              textAlign: "center",
            }}
          >
            ←
          </button>
          <div className="movie-details">
            <img alt={movieDetails.Title} src={movieDetails.Poster}></img>
            <div>
              <h2>{movieDetails.Title}</h2>
              <p style={{ display: "flex", gap: "1rem" }}>
                <span>{movieDetails.Released} •</span>{" "}
                <span>{movieDetails.Runtime}</span>
              </p>
              <p>{movieDetails.Genre}</p>
              <p>{movieDetails.imdbRating} ⭐</p>
            </div>
          </div>
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                margin: "2rem",
              }}
            >
              <div>
                {check?.current?.rated ? (
                  <p>already rated</p>
                ) : (
                  <StarFunc
                    color={"#fcc419"}
                    width={"30px"}
                    num={10}
                    getRating={SetRating}
                  />
                )}
              </div>
              {rating ? (
                <button
                  onClick={() => {
                    setDetails(true);
                    setWatchedList((d) => [
                      ...d,
                      { ...movieDetails, Adrating: rating, rated: true },
                    ]);
                  }}
                  style={{
                    width: "150px",
                    backgroundColor: "greenyellow",
                    border: "none",
                    fontWeight: "bolder",
                  }}
                >
                  <h3>Add to watchlist</h3>
                </button>
              ) : (
                ""
              )}
            </div>
            <p>{movieDetails.Plot}</p>
          </div>
        </div>
      )}
    </>
  );
}
