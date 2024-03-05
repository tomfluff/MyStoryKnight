import React from "react";
import classes from "./PreferencePopover.module.css";
import { ActionIcon, Popover } from "@mantine/core";
import { FaCog } from "react-icons/fa";
import PreferencePane from "../PreferencePane";

type Props = {};

const PreferencePopover = (props: Props) => {
  return (
    <Popover withArrow trapFocus withinPortal position="bottom-end">
      <Popover.Target>
        <ActionIcon variant="default" size="xl" aria-label="Open preference">
          <FaCog />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <PreferencePane />
      </Popover.Dropdown>
    </Popover>
  );
};

export default PreferencePopover;
