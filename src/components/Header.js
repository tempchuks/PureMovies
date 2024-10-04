export default function Header({ query, setQuery, searchresults }) {
  return (
    <div className="header">
      <h1>🎬 PureMovies</h1>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="search movies..."
      />
      <h3>
        <span
          style={{
            fontWeight: "bold",
            fontFamily: "sans-serif",
            fontStyle: "italic",
          }}
        >
          {searchresults}
        </span>{" "}
        result found
      </h3>
    </div>
  );
}
