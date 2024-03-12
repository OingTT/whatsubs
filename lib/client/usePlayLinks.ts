import { Subscription } from '@prisma/client';
import * as cheerio from 'cheerio';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { SubscriptionWithUrl } from './interface';

interface Props {
  link: string;
  flatrate: {
    display_priority: number;
    logo_path: string;
    provider_id: number;
    provider_name: string;
  }[];
}

export default function usePlayLinks(props?: Props) {
  const [playLinks, setPlayLinks] = useState<SubscriptionWithUrl[]>([]);
  const { data: subscriptions } = useSWR<Subscription[]>('/api/subscriptions');
  const { data } = useSWR(subscriptions && props?.link, async url => {
    const response = await fetch(`https://whatsubs.herokuapp.com/${url}`);
    console.log('response', response);
    const html = await response.text();

    const $ = cheerio.load(html);

    const titles: string[] = [];
    const urls: string[] = [];

    $('ul.providers li a').each((_, element) => {
      const title = $(element).attr('title');

      if (title?.[0] === 'W' && !titles.includes(title)) {
        titles.push(title);

        const url = new URLSearchParams($(element).attr('href')).get('r');
        const query = url?.split('?')[1];
        const disneyUrl = query && new URLSearchParams(query).get('u');
        if (url && !urls.includes(url)) {
          urls.push(disneyUrl || url);
        }
      }
    });

    return urls;
  });

  useEffect(() => {
    if (data && subscriptions && props?.flatrate) {
      let index = 0;
      const subscriptionsWithUrl = props.flatrate.reduce((subs, flatrate) => {
        const subscription = subscriptions.find(
          subscription => subscription.providerId === flatrate.provider_id
        );

        return subscription
          ? [
              ...subs,
              {
                ...subscription,
                url: data[index++],
              },
            ]
          : subs;
      }, [] as SubscriptionWithUrl[]);

      setPlayLinks(subscriptionsWithUrl || []);
    }
  }, [data, props?.flatrate, subscriptions]);

  return playLinks;
}
