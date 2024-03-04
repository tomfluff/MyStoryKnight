import { create } from "zustand";
import {
  createJSONStorage,
  devtools,
  persist,
  subscribeWithSelector,
} from "zustand/middleware";
import { createSelectors } from "../utils/createSelectors";
import { TChoice, TStory, TStoryPart } from "../types/Story";

export type TLogElement = {
  time: number;
  type: string;
  data: any;
};

const initialState = {
  id: null as string | null,
  start: Date.now(),
  update: Date.now(),
  log: [] as TLogElement[],
};

export type TSession = typeof initialState;

export const useSessionStore = createSelectors(
  create<TSession>()(
    devtools(
      persist((set, get) => initialState, {
        name: "session",
        storage: createJSONStorage(() => sessionStorage),
      }),
      {
        name: "Session",
      }
    )
  )
);

export const initSession = (id: string) => {
  useSessionStore.setState((state) => {
    return {
      id,
      start: Date.now(),
      update: Date.now(),
    };
  });
};

export const resetSession = () => {
  useSessionStore.setState(initialState);
};

export const addLogging = (type: string, data: any) => {
  useSessionStore.setState((state) => {
    return {
      update: Date.now(),
      log: [
        ...state.log,
        {
          time: Date.now(),
          type,
          data,
        },
      ],
    };
  });
};
