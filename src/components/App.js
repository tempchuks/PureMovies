import { useEffect, useState } from "react";
import Header from "./Header";
import SearchResult from "./SearchResult";

import Details from "./Details";

export default function App() {
  // http://www.omdbapi.com/?i=tt3896198&apikey=899388aa

  const [query, setQuery] = useState("");
  const [searchresults, setSearchResults] = useState([]);
  const [imdbid, setImdbid] = useState(null);
  const [details, setDetails] = useState(true);

  function handleEventClick(id, c) {
    setImdbid(id);
    setDetails(false);
  }
  useEffect(function () {
    return () => {
      document.title = "PureMovies";
    };
  }, []);
  return (
    <div className="app">
      <Header
        query={query}
        setQuery={setQuery}
        searchresults={searchresults.length}
      />
      <Main>
        <SearchResult
          setSearchResults={setSearchResults}
          query={query}
          key={query}
          onSetid={handleEventClick}
        />
        <WatchedMovie
          key="watched"
          imdbid={imdbid}
          details={details}
          setDetails={setDetails}
        />
      </Main>
    </div>
  );
}

function Main({ children }) {
  return (
    <div className="container">
      <main>{children}</main>
    </div>
  );
}

function WatchedMovie({ imdbid, details, setDetails }) {
  const [open, setOpen] = useState(true);
  const data = JSON.parse(localStorage.getItem("watched"));

  const [watchedList, setWatchedList] = useState(data ? data : []);
  useEffect(
    function () {
      if (!watchedList) return;
      localStorage.setItem("watched", JSON.stringify(watchedList));
    },
    [watchedList]
  );
  return (
    <div className="watched-movie" style={{ position: "relative" }}>
      <button
        style={{ float: "right", position: "absolute", right: "0" }}
        onClick={() => setOpen((e) => !e)}
        className="btn"
      >
        {open ? "-" : "+"}
      </button>
      {open &&
        (details ? (
          <Summary
            watchedList={watchedList}
            setWatchedList={setWatchedList}
            key={"summary"}
          />
        ) : (
          <Details
            imdbid={imdbid}
            setDetails={setDetails}
            setWatchedList={setWatchedList}
            watchedList={watchedList}
            key={"summary"}
          />
        ))}
    </div>
  );
}

function WatchedMovieList({ watchedmovie, watchedList, setWatchedList }) {
  return (
    <li
      style={{
        display: "flex",
        borderBottom: "1px solid grey",
        padding: "1rem",
        alignItems: "center",
        gap: "1rem",
        wordSpacing: "0.3rem",
      }}
    >
      <img
        style={{ width: "80px", height: "100px", borderRadius: "5px" }}
        src={watchedmovie.Poster}
        alt={watchedmovie.Title}
      />
      <div style={{ textAlign: "center" }}>
        <h2>
          <strong>{watchedmovie.Title}</strong>
        </h2>
        <p
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            gap: "1rem",
          }}
        >
          <span>
            ⭐<strong>{watchedmovie.imdbRating}</strong>
          </span>
          <span>🌟{watchedmovie.Adrating}</span>
          <span>⏳{watchedmovie.Runtime}</span>
        </p>
      </div>
      <button
        onClick={(e) => {
          const newitem = watchedList?.filter(
            (v) => v.imdbID !== watchedmovie.imdbID
          );
          setWatchedList(newitem);
        }}
        style={{
          backgroundColor: "transparent",
          border: "none",

          fontSize: "20px",
        }}
      >
        ❌
      </button>
    </li>
  );
}
function Summary({ watchedList, setWatchedList }) {
  const imdbAvgRating =
    watchedList?.reduce((p, c) => p + Number(c.imdbRating), 0) /
    watchedList?.length;
  const myAvgRating =
    watchedList?.reduce((p, c) => p + Number(c.Adrating), 0) /
    watchedList?.length;
  const minutesWatched = watchedList.reduce(
    (p, c) => parseInt(p, 10) + parseInt(c.Runtime, 10),
    0
  );

  return (
    <div>
      <div className="summary">
        <h4>Movies You Watched</h4>
        <div
          style={{
            display: "flex",
            gap: "1rem",
          }}
        >
          <p> {watchedList.length} movie</p>
          <p>
            {isNaN(imdbAvgRating.toFixed(1)) ? 0 : imdbAvgRating.toFixed(1)} ⭐
            avg imdb
          </p>
          <p>
            {isNaN(myAvgRating.toFixed(1)) ? 0 : myAvgRating.toFixed(1)} 🌟 avg
          </p>
          <p>{minutesWatched} min</p>
        </div>
      </div>
      <ul>
        {watchedList?.map((v, i) => (
          <WatchedMovieList
            watchedmovie={v}
            key={v.imbdID}
            watchedList={watchedList}
            setWatchedList={setWatchedList}
          />
        ))}
      </ul>
    </div>
  );
}
