import { Comment, ContentType, Subscription } from '@prisma/client';

export interface Certifications {
  certifications: {
    KR?: Array<{
      certification: string;
      meaning: string;
      order: number;
    }>;
  };
}

export interface Collection {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  parts: Array<Movie>;
}

export interface DiscoverMovie {
  page: number;
  results: Movie[];
  total_results: number;
  total_pages: number;
}

export interface DiscoverTV {
  page: number;
  results: TV[];
  total_results: number;
  total_pages: number;
}

export interface Genres {
  genres: Array<{ id: number; name: string }>;
}

export interface Movie {
  type: 'MOVIE';
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

export interface MovieDetail {
  type: 'MOVIE';
  backdrop_path: string;
  belongs_to_collection?: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  };
  genres: Array<{ id: number; name: string }>;
  id: number;
  overview: string;
  poster_path: string;
  release_date: string;
  runtime: number;
  title: string;
  vote_average: number;
  credits: {
    cast: Array<{
      id: number;
      name: string;
      profile_path: string;
      character: string;
    }>;
    crew: Array<{
      id: number;
      name: string;
      profile_path: string;
      job: string;
    }>;
  };
  recommendations: {
    results: Movie[];
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
  similar: {
    results: Movie[];
  };
  'watch/providers': {
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
  type: 'TV';
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

export interface TVDetail {
  type: 'TV';
  backdrop_path: string;
  created_by: Array<{ id: number; name: string; profile_path: string }>;
  genres: Array<{ id: number; name: string }>;
  overview: string;
  poster_path: string;
  episode_run_time: number[];
  first_air_date: string;
  id: number;
  name: string;
  vote_average: number;
  content_ratings: {
    results: Array<{
      iso_3166_1: string;
      rating: string;
    }>;
  };
  aggregate_credits: {
    cast: Array<{
      id: number;
      name: string;
      profile_path: string;
      roles: Array<{
        credit_id: string;
        character: string;
        episode_count: number;
      }>;
    }>;
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
  recommendations: {
    results: TV[];
  };
  similar: {
    results: TV[];
  };
  'watch/providers': {
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

export interface Person {
  adult: boolean;
  also_known_as: string[];
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  known_for: Array<Movie | TV>;
  external_ids: {
    facebook_id: string;
    instagram_id: string;
    tiktok_id: string;
    twitter_id: string;
    youtube_id: string;
  };
  combined_credits: {
    cast: Array<{
      id: number;
      title: string;
      poster_path: string;
      character: string;
      media_type: 'movie' | 'tv';
    }>;
    crew: Array<{
      id: number;
      title: string;
      poster_path: string;
      job: string;
      media_type: 'movie' | 'tv';
    }>;
  };
}

export interface Content {
  type: ContentType;
  id: number;
}

export interface Country {
  iso_3166_1: string;
  english_name: string;
  native_name: string;
}

export interface ExploreForm {
  type: ContentType | 'TVNETWORK';
  filters: string[];
  movieGenres: string[];
  tvGenres: string[];
  movieCertifications: string[];
}

export interface CommentWithCounts extends Comment {
  _count: {
    likes: number;
  };
}

export interface UserWithComment {
  id: number;
  name: string;
  avatar: string;
  reviews: Array<{
    rating: number;
  }>;
  comments: CommentWithCounts[];
}

export interface CommentLike {
  commentId: number;
}

export interface SubscriptionWithUrl extends Subscription {
  url?: string;
}
