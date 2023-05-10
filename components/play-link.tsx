import styled from "@emotion/styled";
import useSWR from "swr";
import * as cheerio from "cheerio";

interface PlayLinks {
  providers: string[];
  urls: string[];
}

export default function PlayLink() {
  const origin_url =
    "https://www.themoviedb.org/movie/550-fight-club/watch?locale=KR";
  const tail_url = origin_url.replace("https://www.themoviedb.org/", "");
  const proxy_url =
    "https://cors-anywhere.herokuapp.com/https://www.themoviedb.org/";
  const result_url = proxy_url + tail_url;

  //console.log({ result_url });

  const { data, error } = useSWR(result_url, async (url) => {
    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html);

    const providers: string[] = [];
    const urls: string[] = [];

    $("ul.providers li a").each((index, element) => {
      const provider = $(element).attr("title");

      if (
        typeof provider === "string" &&
        provider[0] === "W" &&
        !providers.includes(provider)
      ) {
        providers.push(provider);

        const url = $(element).attr("href");

        if (typeof url === "string") {
          urls.push(url);
        }
      }
    });

    return { providers, urls };
  });

  if (error) {
    return <div>Error occurred: {error.message}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ul>
        {data.urls.map((url, index) => (
          <li>
            <a href={url} target="_blank" rel="noreferrer">
              {data.providers[index]}
              <br />
              {url}
              <br />
              {}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
