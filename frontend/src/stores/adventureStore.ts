import { create } from "zustand";
import {
  createJSONStorage,
  devtools,
  persist,
  subscribeWithSelector,
} from "zustand/middleware";
import { createSelectors } from "../utils/createSelectors";
import { TImage } from "../types/Image";
import { TCharacter } from "../types/Character";
import { TPremise } from "../types/Premise";
import { TStory, TStoryPart } from "../types/Story";

const initialState = {
  id: null as string | null,
  image: null as TImage | null,
  character: null as TCharacter | null,
  premise: null as TPremise | null,
  story: null as TStory | null,
};

export const useAdventureStore = createSelectors(
  create<typeof initialState>()(
    devtools(
      persist((set, get) => initialState, {
        name: "character",
        storage: createJSONStorage(() => sessionStorage),
      }),
      {
        name: "Character",
      }
    )
  )
);

export const clearStore = () => {
  useAdventureStore.setState(initialState);
};

export const setCharacter = (
  id: string,
  image: TImage,
  character: TCharacter
) => {
  useAdventureStore.setState((state) => {
    return {
      id,
      image,
      character,
    };
  });
};

export const setPremise = (premise: TPremise) => {
  useAdventureStore.setState((state) => {
    return {
      premise,
    };
  });
};

export const startStory = (start: number, part: TStoryPart) => {
  useAdventureStore.setState((state) => {
    return {
      story: {
        start,
        parts: [part],
      },
    };
  });
};

export const appendStory = (part: TStoryPart) => {
  useAdventureStore.setState((state) => {
    if (!state.story) return state;
    return {
      story: {
        ...state.story,
        parts: [...state.story.parts, part],
      },
    };
  });
};
