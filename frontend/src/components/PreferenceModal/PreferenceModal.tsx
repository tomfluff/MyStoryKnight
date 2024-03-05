import { ActionIcon, Center, Modal } from "@mantine/core";
import React from "react";
import PreferencePane from "../PreferencePane";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { FaCog } from "react-icons/fa";
import classes from "./PreferenceModal.module.css";

type Props = {};

const PreferenceModal = (props: Props) => {
  const [opened, { toggle: toggleOpened }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 50em)");

  return (
    <>
      <ActionIcon
        variant="default"
        size="xl"
        aria-label="Open preference"
        onClick={toggleOpened}
      >
        <FaCog />
      </ActionIcon>
      <Modal
        size="content"
        opened={opened}
        fullScreen={isMobile}
        centered
        title="Application Preferences"
        onClose={toggleOpened}
      >
        <PreferencePane />
      </Modal>
    </>
  );
};

export default PreferenceModal;
