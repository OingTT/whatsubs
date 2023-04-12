import React, { useState } from "react";
import MovieDetail from "@/components/detail/movie-detail";

export default function Detail() {
  const [tmdbId, setTmdbId] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTmdbId(event.target.value);
  };

  return (
    <div>
      <label>
        Enter a TMDB ID:
        <input type="text" value={tmdbId} onChange={handleChange} />
      </label>
      <button onClick={() => setTmdbId("")}>Clear</button>
      {tmdbId && <MovieDetail tmdbId={tmdbId} />}
    </div>
  );
}
