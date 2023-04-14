export interface Movie {
  poster_path: string;
  adult: boolean;
  overview: string;
  release_date: Date;
  genre_ids: number[];
  id: number;
  original_title: string;
  original_language: string;
  title: string;
  backdrop_path: string;
  popularity: number;
  vote_count: number;
  video: boolean;
  vote_average: number;
}

export interface MovieDiscover {
  page: number;
  results: Movie[];
  total_results: number;
  total_pages: number;
}

export interface MovieDetail {
  backdrop_path: string;
  genres: Array<{ id: number; name: string }>;
  overview: string;
  poster_path: string;
  release_date: string;
  title: string;
  vote_average: number;
  credits: {
    cast: Array<{ id: number; name: string; profile_path: string }>;
    crew: Array<{
      id: number;
      name: string;
      profile_path: string;
      job: string;
    }>;
  };
  release_dates: {
    results: Array<{
      iso_3166_1: string;
      release_dates: Array<{
        certification: string;
        iso_639_1: string;
        release_date: string;
        type: number;
        note: string;
      }>;
    }>;
  };
  "watch/providers": {
    results: {
      KR?: {
        link: string;
        flatrate: Array<{
          display_priority: number;
          logo_path: string;
          provider_id: number;
          provider_name: string;
        }>;
      };
    };
  };
}

export interface WatchProvider {
  id: number;
  key: string;
  name: string;
}

export const watchProviders: WatchProvider[] = [
  {
    id: 8,
    key: "netflix",
    name: "Netflix",
  },
  {
    id: 119,
    key: "amazonprimevideo",
    name: "Amazon Prime Video",
  },
  {
    id: 337,
    key: "disneyplus",
    name: "Disney+",
  },
  {
    id: 356,
    key: "wavve",
    name: "Wavve",
  },
  {
    id: 97,
    key: "watcha",
    name: "Watcha",
  },
  {
    id: 350,
    key: "appletvplus",
    name: "Apple TV+",
  },
];
