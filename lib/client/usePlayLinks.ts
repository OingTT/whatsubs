import useSWR from 'swr';
import * as cheerio from 'cheerio';

export default function usePlayLinks(url?: string) {
  const { data: playLinks } = useSWR(url, async url => {
    const response = await fetch(`https://whatsubs.herokuapp.com/${url}`);
    const html = await response.text();

    const $ = cheerio.load(html);

    const providers: string[] = [];
    const urls: string[] = [];

    $('ul.providers li a').each((_, element) => {
      const provider = $(element).attr('title');

      if (
        typeof provider === 'string' &&
        provider[0] === 'W' &&
        !providers.includes(provider)
      ) {
        providers.push(provider);

        const url = $(element).attr('href');

        if (typeof url === 'string') {
          urls.push(url);
        }
      }
    });

    return { providers, urls };
  });

  return playLinks;
}
