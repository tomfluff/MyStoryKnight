import { TEntity } from "./Entity";

export type TAnalytics = {
  entities: TEntity[];
  intensity: string;
  emotion: string;
  positioning: string;
  complexity: string;
};

export type TAction = {
  id: string;
  action: string;
  desc: string;
  active: boolean;
  used: boolean;
};

export type TStoryImage = {
  promt: string;
  url: string;
};

export type TStoryPart = {
  id: string;
  text: string;
  keymoment?: string;
  actions?: TAction[];
  image?: string;
  analytics?: TAnalytics;
};

export type TStory = {
  id: string;
  start: number;
  parts: TStoryPart[];
};
