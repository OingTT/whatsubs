import { ContentType, Subscription } from '@prisma/client';
import { atom } from 'recoil';
import { ExploreForm } from './interface';

export const selectedSubsState = atom<Subscription[]>({
  key: 'selectedSubsState',
  default: [],
});

export const checkedSubsState = atom<Subscription[]>({
  key: 'checkedSubsState',
  default: [],
});

export const expolreFormState = atom<ExploreForm>({
  key: 'expolreFormState',
  default: {
    type: ContentType.MOVIE,
    filters: [],
    movieGenres: [],
    tvGenres: [],
    movieCertifications: [],
  },
});

export const searchQueryState = atom<string>({
  key: 'searchQueryState',
  default: '',
});
