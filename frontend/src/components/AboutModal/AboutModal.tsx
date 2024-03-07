import React from "react";
import {
  Stack,
  ActionIcon,
  Modal,
  Title,
  Text,
  Anchor,
  Divider,
  Box,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { FaInfo } from "react-icons/fa";

type Props = {};

const AboutModal = (props: Props) => {
  const [opened, { toggle: toggleOpened }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 50em)");
  return (
    <>
      <ActionIcon
        variant="default"
        size="xl"
        aria-label="About MyStoryKnight."
        onClick={toggleOpened}
      >
        <FaInfo />
      </ActionIcon>
      <Modal
        size="md"
        opened={opened}
        fullScreen={isMobile}
        centered
        title="About This Project"
        onClose={toggleOpened}
      >
        <Stack gap="sm">
          <Title order={1} fs="italic">
            MyStoryKnight.
          </Title>
          <Text>
            MyStoryKnight is a collaborative storytelling game for children and
            adults. It is designed to be played by two or more players, and can
            be played in person or online. The game is designed to be played in
            a group, and is suitable for children and adults of all ages.
          </Text>
          <Text>
            Use your imagination to draw a unique charater you want follow the
            story with. Choose how the story unfolds at each stage and be the
            great storyteller you are.
          </Text>
          <Divider />
          <Box>
            <Text fz="md">Credits</Text>
            <Text fz="sm">
              Icons made by <i>Icon.doit</i>, <i>Smashicons</i> and{" "}
              <i>Freepik</i> from{" "}
              <Anchor href="https://www.flaticon.com/" target="_blank">
                flaticon
              </Anchor>
              .
            </Text>
          </Box>
        </Stack>
      </Modal>
    </>
  );
};

export default AboutModal;
