import { create } from "zustand";
import {
  createJSONStorage,
  devtools,
  persist,
  subscribeWithSelector,
} from "zustand/middleware";
import { createSelectors } from "../utils/createSelectors";
import { TDrawing } from "../types/Drawing";
import { TPremise } from "../types/Premise";

const initialDrawingState = {
  drawing: null as TDrawing | null,
  premise: [] as TPremise[],
};

export const useDrawingStore = createSelectors(
  create<typeof initialDrawingState>()(
    devtools(
      persist((set, get) => initialDrawingState, {
        name: "drawing",
        storage: createJSONStorage(() => sessionStorage),
      }),
      {
        name: "drawing",
      }
    )
  )
);

export const clearDrawing = () => {
  useDrawingStore.setState((state) => {
    return {
      drawing: null,
      premise: [],
    };
  });
};

export const setDrawing = (drawing: TDrawing) => {
  useDrawingStore.setState((state) => {
    return {
      drawing,
    };
  });
};

export const setPremise = (premise: TPremise[]) => {
  useDrawingStore.setState((state) => {
    return {
      premise,
    };
  });
};
