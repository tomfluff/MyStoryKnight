import React, { useState } from "react";
import {
  Center,
  Card,
  Text,
  SegmentedControl,
  Switch,
  Slider,
  Stack,
  Select,
  Flex,
  Group,
  Box,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  setPreferences,
  usePreferencesStore,
} from "../stores/preferencesStore";

type Props = {};

const PreferencePane = (props: Props) => {
  const languageOptions = [
    { label: "English", value: "en" },
    { label: "Japanese", value: "ja" },
    { label: "Spanish", value: "es" },
  ];
  const storyComplexityOptions = [
    { label: "Easy", value: 0 },
    { label: "Medium", value: 5 },
    { label: "Hard", value: 10 },
  ];

  const [language, setLanguage] = useState(
    usePreferencesStore.getState().language
  );
  const [autoReadStorySections, setAutoReadStorySections] = useState(
    usePreferencesStore.getState().autoReadStorySections
  );
  const [includeStoryImages, setIncludeStoryImages] = useState(
    usePreferencesStore.getState().includeStoryImages
  );
  const [storyComplexity, setStoryComplexity] = useState(
    usePreferencesStore.getState().storyComplexity
  );

  return (
    <Card shadow="sm">
      <Stack gap="md">
        <Select
          label="Story Language"
          description="Select the language of the story."
          radius="md"
          data={languageOptions}
          value={language}
          onChange={(_value, option) => {
            setPreferences({ language: option.value });
            setLanguage(option.value);
          }}
        />
        <Divider />
        <Switch
          checked={autoReadStorySections}
          onChange={(e) => {
            setPreferences({ autoReadStorySections: e.currentTarget.checked });
            setAutoReadStorySections(e.currentTarget.checked);
          }}
          label="Auto-read"
          description="Automatically read the story sections."
        />

        <Switch
          checked={includeStoryImages}
          onChange={(e) => {
            setPreferences({ includeStoryImages: e.currentTarget.checked });
            setIncludeStoryImages(e.currentTarget.checked);
          }}
          label="Story Images"
          description="Include images in the story."
        />

        <Divider />
        <Box>
          <Text size="sm">Story Complexity</Text>
          <Slider
            step={5}
            marks={storyComplexityOptions}
            label={null}
            value={storyComplexity}
            onChange={(value) => {
              setPreferences({ storyComplexity: value });
              setStoryComplexity(value);
            }}
            min={0}
            max={10}
            mb="md"
            mt="xs"
          />
        </Box>
      </Stack>
    </Card>
  );
};

export default PreferencePane;
