import { ContentType, Subscription } from "@prisma/client";
import { atom } from "recoil";

export const selectedSubsState = atom<Subscription[]>({
  key: "selectedSubsState",
  default: [],
});

export const checkedSubsState = atom<Subscription[]>({
  key: "checkedSubsState",
  default: [],
});

export const exploreTypeState = atom<ContentType | "TVNETWORK">({
  key: "exploreTypeState",
  default: ContentType.MOVIE,
});

export const searchQueryState = atom<string>({
  key: "searchQueryState",
  default: "",
});

export const genreState = atom<string[]>({
  key: "genreState",
  default: [],
});

export const tvGenreState = atom<string[]>({
  key: "tvGenreState",
  default: [],
});

export const certificationState = atom<string[]>({
  key: "certificationState",
  default: [],
});

export const tvCertificationState = atom<string[]>({
  key: "tvCertificationState",
  default: [],
});
