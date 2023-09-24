import {
  getKoreanDepartment,
  getKoreanName,
  getTmdbImagePath,
} from '@/lib/client/api';
import { Person } from '@/lib/client/interface';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import MiniCard from './mini-card';
import MiniCardSkeleton from './mini-card-skeleton';

interface PersonCardProps {
  id: number;
  subtitle?: string;
}

const fetchTranslation = async (name: string) => {
  const response = await fetch(`/api/translate/${encodeURIComponent(name)}`);
  const data = await response.json();
  return data.translatedText || '';
};

export default function PersonCard({ id, subtitle }: PersonCardProps) {
  const { data } = useSWR<Person>(
    `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&append_to_response=external_ids,combined_credits&language=ko-KR`
  );
  const { data: translatedName } = useSWRImmutable(
    data && !getKoreanName(data) && data.name,
    fetchTranslation
  );

  return data ? (
    <MiniCard
      title={getKoreanName(data) || translatedName || data.name}
      subtitle={subtitle || getKoreanDepartment(data.known_for_department)}
      src={getTmdbImagePath(data.profile_path, 'w154')}
      href={`/person/${id}`}
    />
  ) : (
    <MiniCardSkeleton />
  );
}
