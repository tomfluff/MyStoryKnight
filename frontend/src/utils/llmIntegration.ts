import { usePreferencesStore } from "../stores/preferencesStore";

type TComplexity = {
  value: number;
  label: string;
  prompt: string;
};

export const complexityOptions: TComplexity[] = [
  {
    value: 0,
    label: "Easy",
    prompt:
      "Kindergarden to 5th grade level of language and concepts. No complex words or ideas. Short sentences and paragraphs.",
  },
  {
    value: 1,
    label: "Medium",
    prompt:
      "6th grade to 9th grade level of language and concepts. Some complex words and ideas. Short sentences and paragraphs.",
  },
  {
    value: 2,
    label: "Hard",
    prompt:
      "10th grade to 12th grade level of language and concepts. Many complex words and ideas. Long sentences and paragraphs.",
  },
  {
    value: 3,
    label: "Expert",
    prompt:
      "Professional level of language and concepts. Many complex words and ideas. Long sentences and paragraphs.",
  },
];

export const getComplexityPrompt = (complexity: number) => {
  return complexityOptions.find((d) => d.value === complexity)?.prompt;
};

export const createCallContext = (data: any) => {
  const complexity = usePreferencesStore.getState().storyComplexity;
  const complexityPrompt = getComplexityPrompt(complexity);
  return {
    complexity: complexityPrompt,
    context: data,
  };
};
