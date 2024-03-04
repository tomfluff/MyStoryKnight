import { TCharacter, TImage } from "./Image";
import { TEntity } from "./Entity";
import { TPremise } from "./Premise";

export type TAnalytics = {
  entities: TEntity[];
  intensity: string;
  emotion: string;
  positioning: string;
  complexity: string;
};

export type TChoice = {
  id: number;
  title: string;
  description: string;
  content: string;
  keymoment: string;
};

export type TStoryImage = {
  promt: string;
  url: string;
};

export type TStoryPart = {
  id: number;
  time: number;
  trigger: string;
  text: string;
  keymoment: string;
  image?: string;
  analytics?: TAnalytics;
};

export type TStory = {
  id: string;
  character: TCharacter;
  init_time: string;
  premise: TPremise;
  parts: TStoryPart[];
};
