import React from "react";
import {
  Text,
  Button,
  Menu,
  Group,
  ActionIcon,
  rem,
  useMantineTheme,
  Popover,
  Stack,
  Loader,
} from "@mantine/core";
import { TAction } from "../types/Story";
import { FaEllipsisVertical } from "react-icons/fa6";
import ReadController from "./ReadController";
import {
  appendStory,
  chooseAction,
  getStoryText,
  useAdventureStore,
} from "../stores/adventureStore";
import { useMutation } from "@tanstack/react-query";
import getAxiosInstance from "../utils/axiosInstance";

type Props = {
  action: TAction;
  handleClick: () => void;
};

const ActionButton = ({ action, handleClick }: Props) => {
  const theme = useMantineTheme();

  return (
    <Group wrap="nowrap" gap={0}>
      <Button
        size="sm"
        style={{
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }}
        color={!action.active ? (action.used ? "violet" : "gray") : "violet"}
        onClick={handleClick}
        disabled={!action.active && !action.used}
      >
        {action.action}
      </Button>
      <Popover width={300} position="top" withinPortal withArrow>
        <Popover.Target>
          <Button
            size="sm"
            px="xs"
            color={
              !action.active ? (action.used ? "violet" : "gray") : "violet"
            }
            style={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}
          >
            <FaEllipsisVertical />
          </Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Stack gap="xs">
            <Text>{action.desc}</Text>
            <ReadController id="action" text={action.desc} />
          </Stack>
        </Popover.Dropdown>
      </Popover>
    </Group>
  );
};

export default ActionButton;
