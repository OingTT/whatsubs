import { ContentType } from "@prisma/client";

export interface Movie {
  type: "MOVIE";
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

export interface TV {
  type: "TV";
  poster_path: string;
  popularity: number;
  id: number;
  backdrop_path: string;
  vote_average: number;
  overview: string;
  first_air_date: Date;
  origin_country: string[];
  genre_ids: number[];
  original_language: string;
  vote_count: number;
  name: string;
  original_name: string;
}

export interface TVDiscover {
  page: number;
  results: TV[];
  total_results: number;
  total_pages: number;
}

export interface TVDetail {
  backdrop_path: string;
  created_by: Array<{ id: number; name: string; profile_path: string }>;
  genres: Array<{ id: number; name: string }>;
  overview: string;
  poster_path: string;
  first_air_date: string;
  name: string;
  vote_average: number;
  content_ratings: {
    results: Array<{
      iso_3166_1: string;
      rating: string;
    }>;
  };
  aggregate_credits: {
    cast: Array<{ id: number; name: string; profile_path: string }>;
    crew: Array<{
      id: number;
      name: string;
      profile_path: string;
      job: string;
    }>;
  };
  seasons: Array<{
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
  }>;
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

export interface Content {
  type: ContentType;
  id: number;
}
