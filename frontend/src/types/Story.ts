import { TEntity } from "./Entity";

export type TAnalytics = {
  entities: TEntity[];
  intensity: string;
  emotion: string;
  positioning: string;
  complexity: string;
};

export type TAction = {
  action: string;
  desc: string;
};

export type TStoryImage = {
  promt: string;
  url: string;
};

export type TStoryPart = {
  text: string;
  keymoment?: string;
  trigger?: TAction;
  image?: string;
  analytics?: TAnalytics;
};

export type TStory = {
  start: number;
  parts: TStoryPart[];
};
