import React, { useState } from "react";
import TvDetail from "@/components/detail/tv-detail";

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
      {tmdbId && <TvDetail tmdbId={tmdbId} />}
    </div>
  );
}
