import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { createSelectors } from "../utils/createSelectors";
import { TAction, TStory, TStoryPart } from "../types/Story";

const initialState = {
  id: null as string | null,
  story: null as TStory | null,
  finished: false,
};

export const usePractice3ThingsStore = createSelectors(
  create<typeof initialState>()(
    devtools(
      persist(() => initialState, {
        name: "3things",
        storage: createJSONStorage(() => sessionStorage),
      }),
      {
        name: "3Things",
      }
    )
  )
);

export const clear3ThingsStore = () => {
    usePractice3ThingsStore.setState(initialState);
};

// export const setCharacter = (
//   id: string,
//   image: TImage,
//   character: TCharacter
// ) => {
//   usePractice3ThingsStore.setState(() => {
//     return {
//       id,
//       image,
//       character,
//     };
//   });
// };

// export const setPremise = (premise: TPremise) => {
//   usePractice3ThingsStore.setState(() => {
//     return {
//       premise,
//     };
//   });
// };

export const startStory = (story: TStory) => {
  usePractice3ThingsStore.setState(() => {
    console.log("Practice3ThingsStore -> startStory - story:", story);
    if (story.parts && story.parts[0]) {
        if (!story.parts[0].actions) {
          story.parts[0].actions = [];
        }
        story.parts[0].actions[0] = {id: "", title: "Motion Capture", desc: "Use your body to progress the story!", active: true, used: false};
    }
    console.log("Practice3ThingsStore -> startStory - story:", story);
    return {
      story,
    };
  });
};

export const appendStory = (part: TStoryPart) => {
  usePractice3ThingsStore.setState((state) => {
    if (!state.story) return state;
    // if (!part.actions) {
    //   part.actions = [];
    // }
    // if (start) {
    //   part.actions[0] = {id: "", title: "Motion Capture", desc: "Use your body to progress the story!", active: true, used: false};
    // } else {
    //   part.actions[0] = {id: "", title: "Next", desc: "Generate a new story to conclude!", active: true, used: false};
    //   part.actions[1] = {id: "", title: "Try again", desc: "Try to finish the previous story again!", active: true, used: false};
    //   part.actions[2] = {id: "", title: "Finish", desc: "Finish the practice and return to the main screen!", active: true, used: false};
    // }
    console.log("Story lenght in appendStory: ", state.story.parts.length);
    return {
      story: {
        ...state.story,
        parts: [...state.story.parts, part],
      },
    };
  });
};

// export const tryAgain = () => {
//   usePractice3ThingsStore.setState((state) => {
//     if (!state.story) return state;
//     const redopart = state.story.parts[state.story.parts.length - 2];
//     return {
//       story: {
//         ...state.story,
//         parts: [...state.story.parts, redopart],
//       },
//     };
//   });
// }

// export const updateActions = (actions: TAction[]) => {
//   usePractice3ThingsStore.setState((state) => {
//     if (!state.story) return state;
//     const parts = state.story.parts;
//     parts[parts.length - 1].actions = actions;
//     return {
//       story: {
//         ...state.story,
//         parts,
//       },
//     };
//   });
// };

// export const chooseAction = (action: TAction | null) => {
//   if (action === null) {
//     action = {id: "", title: "Motion Capture", desc: "", active: true, used: false};
//     usePractice3ThingsStore.setState((state) => {
//       if (!state.story) return state;
//       const parts = state.story.parts;
//       parts[parts.length - 2].actions = parts[parts.length - 2].actions?.map(
//         (a) => {
//           a.active = false;
//           if (a.title === action?.title) {
//             a.used = true;
//           }
//           return a;
//         }
//       );
//       return {
//         story: {
//           ...state.story,
//           parts,
//         },
//       };
//     });
//   }
//   usePractice3ThingsStore.setState((state) => {
//     if (!state.story) return state;
//     const parts = state.story.parts;
//     parts[parts.length - 1].actions = parts[parts.length - 1].actions?.map(
//       (a) => {
//         a.active = false;
//         if (a.title === action.title) {
//           a.used = true;
//         }
//         return a;
//       }
//     );
//     return {
//       story: {
//         ...state.story,
//         parts,
//       },
//     };
//   });
// };

export const printState = () => {
  console.log("Story state: ", usePractice3ThingsStore.getState());
}

export const getLastStoryText = () => {
  const parts = usePractice3ThingsStore.getState().story?.parts;
  return parts ? parts[parts.length - 1].text : null;
};

// export const canChooseAction = () => {
//   return usePractice3ThingsStore
//     .getState()
//     .story?.parts[
//         usePractice3ThingsStore.getState().story!.parts.length - 1
//     ].actions?.every((a) => !a.used);
// };

// export const updateStoryImage = (image_url: string) => {
//   usePractice3ThingsStore.setState((state) => {
//     if (!state.story) return state;
//     const parts = state.story.parts;
//     parts[parts.length - 1].image = image_url;
//     return {
//       story: {
//         ...state.story,
//         parts,
//       },
//     };
//   });
// };

export const setFinished = (status: boolean | undefined) => {
  usePractice3ThingsStore.setState((state) => {
    return {
      ...state,
      finished: status,
    };
  });
};
