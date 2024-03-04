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

const initialState = {
  id: null as string | null,
  image: null as TImage | null,
  character: null as TCharacter | null,
  premise: [] as TPremise[],
};

export const useCharacterStore = createSelectors(
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

export const clearCharacter = () => {
  useCharacterStore.setState((state) => {
    return {
      id: null,
      image: null,
      character: null,
      premise: [],
    };
  });
};

export const setCharacter = (
  id: string,
  image: TImage,
  character: TCharacter
) => {
  useCharacterStore.setState((state) => {
    return {
      id,
      image,
      character,
    };
  });
};

export const setPremise = (premise: TPremise[]) => {
  useCharacterStore.setState((state) => {
    return {
      premise,
    };
  });
};
