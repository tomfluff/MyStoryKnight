import { TStory } from "./Story";

export type TSession = {
  id: string;
  init_time: number;
  last_update: number;
  story: TStory | null;
};
