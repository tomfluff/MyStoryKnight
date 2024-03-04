import { create } from "zustand";
import {
  createJSONStorage,
  devtools,
  persist,
  subscribeWithSelector,
} from "zustand/middleware";
import { createSelectors } from "../utils/createSelectors";

const initialState = {
  audioAutoPlay: false,
  audioVolume: 1,
  audioSpeed: 1,
  language: "en",
};

export type TPreferences = typeof initialState;

export const usePreferencesStore = createSelectors(
  create<TPreferences>()(
    devtools(
      persist((set, get) => initialState, {
        name: "preferences",
        storage: createJSONStorage(() => sessionStorage),
      }),
      {
        name: "Preferences",
      }
    )
  )
);

export const setSettings = (preferences: TPreferences) => {
  usePreferencesStore.setState(preferences);
};

export const setAudioAutoPlay = (audioAutoPlay: boolean) => {
  usePreferencesStore.setState((state) => ({
    ...state,
    audioAutoPlay,
  }));
};

export const setAudioVolume = (audioVolume: number) => {
  usePreferencesStore.setState((state) => ({
    ...state,
    audioVolume,
  }));
};

export const setAudioSpeed = (audioSpeed: number) => {
  usePreferencesStore.setState((state) => ({
    ...state,
    audioSpeed,
  }));
};
