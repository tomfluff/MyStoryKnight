import { create } from "zustand";
import {
  createJSONStorage,
  devtools,
  persist,
  subscribeWithSelector,
} from "zustand/middleware";
import { createSelectors } from "../utils/createSelectors";
import { TSettings } from "../types/Settings";

const initialSettingsState: TSettings = {
  audioAutoPlay: false,
  audioVolume: 1,
  audioSpeed: 1,
};

export const useSettingsStore = createSelectors(
  create<TSettings>()(
    devtools(
      persist((set, get) => initialSettingsState, {
        name: "settings",
        storage: createJSONStorage(() => sessionStorage),
      }),
      {
        name: "settings",
      }
    )
  )
);

export const setSettings = (settings: TSettings) => {
  useSettingsStore.setState(settings);
};

export const setAudioAutoPlay = (audioAutoPlay: boolean) => {
  useSettingsStore.setState((state) => ({
    ...state,
    audioAutoPlay,
  }));
};

export const setAudioVolume = (audioVolume: number) => {
  useSettingsStore.setState((state) => ({
    ...state,
    audioVolume,
  }));
};

export const setAudioSpeed = (audioSpeed: number) => {
  useSettingsStore.setState((state) => ({
    ...state,
    audioSpeed,
  }));
};
