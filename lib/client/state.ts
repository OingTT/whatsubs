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
