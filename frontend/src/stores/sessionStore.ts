import { create } from "zustand";
import {
  createJSONStorage,
  devtools,
  persist,
  subscribeWithSelector,
} from "zustand/middleware";
import { createSelectors } from "../utils/createSelectors";
import { TSession } from "../types/Session";
import { TChoice, TStory, TStoryPart } from "../types/Story";

const initialSessionState: TSession = {
  id: "",
  init_time: Date.now(),
  last_update: Date.now(),
  story: null,
};

export const useSessionStore = createSelectors(
  create<TSession>()(
    devtools(
      persist((set, get) => initialSessionState, {
        name: "session",
        storage: createJSONStorage(() => sessionStorage),
      }),
      {
        name: "session",
      }
    )
  )
);

export const setSession = (session: TSession) => {
  useSessionStore.setState(session);
};

export const setStory = (story: TStory) => {
  useSessionStore.setState((state) => ({
    ...state,
    story: story,
  }));
};

export const addStoryPart = (part: TStoryPart) => {
  useSessionStore.setState((state) => {
    if (!state.story) return state;
    const story = state.story;
    story.parts.push(part);
    return {
      ...state,
      story: story,
    };
  });
};
