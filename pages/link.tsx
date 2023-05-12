import React, { useState } from "react";
import PlayLink from "@/components/play-link";

export default function Link() {
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
      <br></br>
      {tmdbId}
      <PlayLink />
    </div>
  );
}
