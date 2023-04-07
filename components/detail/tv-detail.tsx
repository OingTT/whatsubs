import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import axios from "axios";

const TvDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;
`;

const Poster = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const ListItem = styled.li`
  margin-right: 20px;
  list-style-type: none;
`;

const ListItemImage = styled.img`
  width: 150px;
  height: auto;
  object-fit: cover;
`;

interface TvDetail {
  backdrop_path: string;
  name: string;
  overview: string;
  first_air_date: string;
  genres: Array<{ id: number; name: string }>;
  credits: {
    cast: Array<{ id: number; name: string; profile_path: string }>;
    crew: Array<{
      id: number;
      name: string;
      profile_path: string;
      job: string;
    }>;
  };
  content_ratings: {
    results: Array<{
      iso_3166_1: string;
      rating: string;
    }>;
    id: number;
  };
  vote_average: number;
  watchProviders: {
    link: string;
    flatrate?: Array<{
      display_priority: number;
      logo_path: string;
      provider_id: number;
      provider_name: string;
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

interface Props {
  tmdbId: string;
}

export default function TvDetail({ tmdbId }: Props) {
  const [tvDetail, setTvDetail] = useState<TvDetail | null>(null);

  useEffect(() => {
    const fetchTvDetail = async () => {
      try {
        const response = await axios.get<TvDetail>(
          `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR&watch_region=KR&append_to_response=credits,watch/providers,content_ratings`
        );
        console.log(response.data);
        const updateData = {
          ...response.data,
          watchProviders: response.data["watch/providers"].results.KR as any,
        };
        setTvDetail(updateData);
        console.log(updateData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTvDetail();
  }, [tmdbId]);

  if (!tvDetail) {
    return <div>Loading...</div>;
  }

  const {
    backdrop_path,
    name,
    overview,
    first_air_date,
    genres,
    credits: { cast, crew },
    content_ratings,
    vote_average,
    watchProviders,
  } = tvDetail;

  const genreList = genres.map((genre) => genre.name).join(", ");
  const director = crew.find((member) => member.job === "Director");
  const screenwriter = crew.find((member) => member.job === "Screenplay");

  let ottList = null;
  if (watchProviders && watchProviders.flatrate) {
    ottList = watchProviders.flatrate.map((provider) => (
      <ListItem key={provider.provider_id}>
        <ListItemImage
          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
          alt={`${provider.provider_name} logo`}
        />
      </ListItem>
    ));
  }

  if (!director) {
    // 검색 결과가 undefined일 경우, 감독이 없다는 메시지 출력
    console.log("감독 없음.");
  }

  if (!screenwriter) {
    // 검색 결과가 undefined일 경우, 각본가가 없다는 메시지 출력
    console.log("각본가 없음.");
  }

  return (
    <TvDetailContainer>
      <Poster
        src={`https://image.tmdb.org/t/p/original/${backdrop_path}`}
        alt={name}
      />
      <div>
        <Title>제목: {name}</Title>
        <br></br>
        <p>평점: {vote_average}</p>

        <h2>OTTs</h2>
        <List>{ottList}</List>

        <br></br>
        <p>개봉일: {first_air_date}</p>
        <p>장르: {genreList}</p>
        <p>
          관람등급:{" "}
          {
            content_ratings.results.find((result) => result.iso_3166_1 === "KR")
              ?.rating
          }
        </p>
        <p>시놉시스: {overview}</p>

        <h2>배우</h2>
        <List>
          {cast.map((member) => (
            <ListItem key={member.id}>
              <ListItemImage
                src={`https://image.tmdb.org/t/p/original/${member.profile_path}`}
                alt={member.name}
              />
              <p>{member.name}</p>
            </ListItem>
          ))}
        </List>

        {director && (
          <div>
            <h2>감독</h2>
            <List>
              <ListItem key={director.id}>
                <ListItemImage
                  src={`https://image.tmdb.org/t/p/original${director.profile_path}`}
                  alt={director.name}
                />
                <p>{director.name}</p>
              </ListItem>
            </List>
          </div>
        )}

        {screenwriter !== undefined && screenwriter !== null && (
          <div>
            <h2>각본</h2>
            <List>
              <ListItem key={screenwriter.id}>
                <ListItemImage
                  src={`https://image.tmdb.org/t/p/w200${screenwriter.profile_path}`}
                  alt={screenwriter.name}
                />
                <p>{screenwriter.name}</p>
              </ListItem>
            </List>
          </div>
        )}
      </div>
    </TvDetailContainer>
  );
}
